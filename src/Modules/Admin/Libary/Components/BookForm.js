import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookThunk,
  updateBookThunk,
  fetchBookByISBNThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { message } from "antd";
import ScanModeView from "./ScanModeView";
import BookFormView from "./BookFormView";
import BookFoundView from "./BookFoundView";

const BookForm = ({ book, onClose }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);

  const {
    library: {
      categories: categoriesList,
      addbookloading: loading,
      addBookSuccess: success,
      isbnLoading,
      isbnBookData,
    },
  } = useSelector((state) => state.admin);

  /* ----------------------------- local form state ----------------------------- */
  const [formState, setFormState] = useState({
    bookData: {
      bookName: "",
      authorName: "",
      class: null,
      categories: [],
      copies: "1",
      bookImage: null,
      barcodeValue: "",
      language: "en",
    },
    imagePreview: null,
    errors: {},
    imageKey: Date.now(),
    scannedBarcode: "",
    googleBookData: null,
    existingBook: null,
  });

  const {
    bookData,
    imagePreview,
    errors,
    imageKey,
    scannedBarcode,
    googleBookData,
    existingBook,
  } = formState;

  /* ------------------------------- helpers ------------------------------------ */
  const updateFormState = (updates) =>
    setFormState((prev) => ({ ...prev, ...updates }));

  const resetForm = () => {
    setFormState({
      bookData: {
        bookName: "",
        authorName: "",
        class: null,
        categories: [],
        copies: "1",
        bookImage: null,
        barcodeValue: "",
        language: "en",
      },
      imagePreview: null,
      errors: {},
      imageKey: Date.now(),
      scannedBarcode: "",
      googleBookData: null,
      existingBook: null,
    });
  };

  /* ---------------------------- effect hooks ---------------------------------- */
  useEffect(() => {
    if (book) {
      const initialCategories = Array.isArray(book.categories)
        ? book.categories.map((c) => c._id || c)
        : [];

      setFormState((prev) => ({
        ...prev,
        bookData: {
          bookName: book.name || "",
          authorName: book.author || "",
          class: book.classId?._id || book.classId || null,
          categories: initialCategories,
          copies: book.copies?.toString() || "1",
          bookImage: null,
          barcodeValue: book.barcodeValue || "",
          language: book.language || "en",
        },
        imagePreview: book.image || null,
      }));
    }
  }, [book]);

  useEffect(() => {
    if (success && !book) {
      resetForm();
      onClose();
    }
  }, [success, onClose, book]);

  useEffect(() => {
    if (isbnBookData && scannedBarcode && !isbnLoading) {
      if (isbnBookData.exists && isbnBookData.book) {
        handleExistingBook(isbnBookData.book);
      } else if (isbnBookData.book) {
        handleNewBookFromGoogle(isbnBookData);
      } else {
        handleBookNotFound();
      }
    }
  }, [isbnBookData, scannedBarcode, isbnLoading, t]);

  /* --------------------------- barcode helpers -------------------------------- */
  const handleScanComplete = (barcodeValue) => {
    const cleanBarcode = barcodeValue.replace(/\D/g, "");
    if (!/^(97[89]\d{10}|\d{10})$/.test(cleanBarcode)) {
      toast.error(t("Invalid barcode format"));
      return;
    }

    updateFormState({ scannedBarcode: cleanBarcode });
    dispatch(fetchBookByISBNThunk(cleanBarcode));
  };

  /* CHANGE #1 ================================================================ */
  /**
   * Manual entry now runs through the **exact same** code-path
   * as the scanner, so scannedBarcode is set before the thunk dispatches.
   */
  const handleManualBarcodeEntry = (barcode) => {
    if (!barcode) {
      message.error(t("Please enter a valid barcode"));
      return;
    }
    if (!/^(97[89]\d{10}|\d{10})$/.test(barcode)) {
      message.error(t("Invalid barcode format"));
      return;
    }

    // simply reuse the scan helper
    handleScanComplete(barcode);
  };
  /* ========================================================================= */

  /* -------------------------- existing / new book -------------------------- */
  const handleExistingBook = (book) => {
    setFormState((prev) => ({
      ...prev,
      existingBook: book,
      bookData: {
        ...prev.bookData,
        bookName: book.name || "",
        authorName: book.author || "",
        class: book.classId?._id || book.classId || null,
        categories: book.categories?.map((c) => c._id) || [],
        // copies: (parseInt(book.copies || 0) + 1).toString(),
        copies: "1",

        barcodeValue: scannedBarcode,
        language: book.language || "en",
      },
      imagePreview: book.image || null,
    }));
  };

  const handleNewBookFromGoogle = (isbnBookData) => {
    toast(t("New book detected from Google Books. Please verify details."), {
      icon: "ℹ️",
    });
    setFormState((prev) => ({
      ...prev,
      bookData: {
        ...prev.bookData,
        bookName: isbnBookData.book.name || "",
        authorName: isbnBookData.book.author || "",
        barcodeValue: scannedBarcode,
        copies: "1",
        language: isbnBookData.book.language || "en",
      },
      googleBookData: isbnBookData.googleData || null,
      imagePreview: isbnBookData.book.image || null,
    }));
  };

  const handleBookNotFound = () => {
    toast(
      t("No book found with this barcode. Please enter details manually."),
      { icon: "⚠️" }
    );
    setFormState((prev) => ({
      ...prev,
      bookData: {
        ...prev.bookData,
        barcodeValue: scannedBarcode,
        copies: "1",
      },
    }));
  };

  /* ------------------------------ form logic ------------------------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormState({
      bookData: { ...bookData, [name]: value },
      errors: { ...errors, [name]: undefined },
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateFormState({ imagePreview: reader.result });
      reader.readAsDataURL(file);
      updateFormState({
        bookData: { ...bookData, bookImage: file },
      });
    }
  };

  const handleRemoveImage = () =>
    updateFormState({
      bookData: { ...bookData, bookImage: null },
      imagePreview: null,
      imageKey: Date.now(),
    });

  const validateForm = () => {
    const newErrors = {};
    if (!bookData.bookName.trim())
      newErrors.bookName = t("Book name is required.");
    if (!bookData.authorName.trim())
      newErrors.authorName = t("Author name is required.");
    if (bookData.categories.length === 0)
      newErrors.categories = t("At least one category is required.");
    if (Number(bookData.copies) < 1)
      newErrors.copies = t("Copies must be at least 1.");

    updateFormState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = createFormData();

    if (existingBook) {
      dispatch(
        updateBookThunk({
          bookId: existingBook._id,
          formData,
        })
      ).then(() => onClose());
    } else if (book) {
      dispatch(
        updateBookThunk({
          bookId: book._id,
          formData,
        })
      ).then(() => onClose());
    } else {
      dispatch(addBookThunk(formData));
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("name", bookData.bookName);
    formData.append("author", bookData.authorName);
    formData.append("classId", bookData.class || "");
    bookData.categories.forEach((catId) =>
      formData.append("categories", catId)
    );
    formData.append("copies", bookData.copies);
    formData.append("language", bookData.language);
    if (bookData.bookImage) formData.append("image", bookData.bookImage);
    if (bookData.barcodeValue)
      formData.append("barcodeValue", bookData.barcodeValue);
    return formData;
  };

  const continueWithoutBarcode = () =>
    updateFormState({ scannedBarcode: "", existingBook: null });

  const handleEditBook = () => updateFormState({ existingBook: null });

  const handleIncrementCopy = () =>
    updateFormState({
      bookData: {
        ...bookData,
        copies: (parseInt(bookData.copies) + 1).toString(),
      },
    });

  const handleDecrementCopy = () =>
    updateFormState({
      bookData: {
        ...bookData,
        copies: Math.max(1, parseInt(bookData.copies) - 1).toString(),
      },
    });

  /* ============================== render ==================================== */
  if (existingBook) {
    return (
      <BookFoundView
        book={existingBook}
        copies={bookData.copies}
        onEdit={handleEditBook}
        onIncrement={handleIncrementCopy}
        onDecrement={handleDecrementCopy}
        onSubmit={handleSubmit}
        loading={loading}
        onClose={onClose}
      />
    );
  }

  if (!book && !scannedBarcode) {
    return (
      <ScanModeView
        onScanComplete={handleScanComplete}
        onManualBarcodeEntry={handleManualBarcodeEntry}
        isbnLoading={isbnLoading}
        onContinueWithoutBarcode={continueWithoutBarcode}
      />
    );
  }

  return (
    <BookFormView
      scannedBarcode={scannedBarcode}
      googleBookData={googleBookData}
      onToggleScanMode={continueWithoutBarcode}
      onHideGoogleData={() => updateFormState({ googleBookData: null })}
      imageKey={imageKey}
      imagePreview={imagePreview}
      onImageChange={handleImageChange}
      onRemoveImage={handleRemoveImage}
      bookData={bookData}
      onInputChange={handleInputChange}
      onClassChange={(value) =>
        updateFormState({ bookData: { ...bookData, class: value } })
      }
      onCategoriesChange={(value) =>
        updateFormState({ bookData: { ...bookData, categories: value } })
      }
      errors={errors}
      classList={classList}
      categoriesList={categoriesList}
      onSubmit={handleSubmit}
      loading={loading}
      book={book}
    />
  );
};

export default BookForm;
