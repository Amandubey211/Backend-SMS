import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBookThunk,
  updateBookThunk,
  fetchBookByISBNThunk,
  addBookWithISBNThunk,
} from "../../../../Store/Slices/Admin/Library/LibraryThunks";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { message } from "antd";
import BookScannerModal from "./BookScannerModal";
import ScanModeView from "./ScanModeView";
import BookFormView from "./BookFormView";

const BookForm = ({ book, onClose }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const classList = useSelector((state) => state.admin.class.classes);
  // Selectors
  const {
    library: {
      categories: categoriesList,
      addbookloading: loading,
      addBookSuccess: success,
      isbnLoading,
      isbnBookData,
    },
  } = useSelector((state) => state.admin);

  // State
  const [initialScanComplete, setInitialScanComplete] = useState(false);
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
    showScannerModal: false,
    copied: false,
    googleBookData: null,
  });

  // Destructure state
  const {
    bookData,
    imagePreview,
    errors,
    imageKey,
    scannedBarcode,
    showScannerModal,
    copied,
    googleBookData,
  } = formState;

  // Effects
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
      setInitialScanComplete(true);
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
      if (isbnBookData.exists) {
        handleExistingBook();
      } else if (isbnBookData.book) {
        handleNewBookFromGoogle();
      } else {
        handleBookNotFound();
      }
      setInitialScanComplete(true);
    }
  }, [isbnBookData, scannedBarcode, isbnLoading, t]);

  // Helper Functions
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
      showScannerModal: false,
      copied: false,
      googleBookData: null,
    });
    setInitialScanComplete(false);
  };

  const handleExistingBook = () => {
    toast.success(t("Book found in system. Updating details."));
    setFormState((prev) => ({
      ...prev,
      bookData: {
        ...prev.bookData,
        bookName: isbnBookData.book.name || "",
        authorName: isbnBookData.book.author || "",
        class:
          isbnBookData.book.classId?._id || isbnBookData.book.classId || null,
        categories: isbnBookData.book.categories?.map((c) => c._id) || [],
        copies: (parseInt(isbnBookData.book.copies || 0) + 1).toString(),
        barcodeValue: scannedBarcode,
        language: isbnBookData.book.language || "en",
      },
      imagePreview: isbnBookData.book.image || null,
    }));
  };

  const handleNewBookFromGoogle = () => {
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
      {
        icon: "⚠️",
      }
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

  // Event Handlers
  const updateFormState = (updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

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

  const handleRemoveImage = () => {
    updateFormState({
      bookData: { ...bookData, bookImage: null },
      imagePreview: null,
      imageKey: Date.now(),
    });
  };

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

    if (bookData.barcodeValue) {
      const cleanBarcode = bookData.barcodeValue.replace(/\D/g, "");
      if (cleanBarcode.startsWith("978") && cleanBarcode.length !== 13) {
        newErrors.barcodeValue = t(
          "ISBN must be 13 digits when starting with 978"
        );
      } else if (
        !cleanBarcode.startsWith("978") &&
        cleanBarcode.length !== 10
      ) {
        newErrors.barcodeValue = t(
          "ISBN must be 10 digits when not starting with 978"
        );
      }
    }

    updateFormState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = createFormData();
    if (bookData.barcodeValue) {
      dispatch(
        addBookWithISBNThunk({
          formData,
        })
      );
    } else {
      handleRegularBookSubmit(formData);
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

  const handleRegularBookSubmit = (formData) => {
    if (book) {
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

  const handleScanComplete = (barcodeValue) => {
    const cleanBarcode = barcodeValue.replace(/\D/g, "");
    if (!/^(97[89]\d{10}|\d{10})$/.test(cleanBarcode)) {
      toast.error(t("Invalid barcode format"));
      return;
    }

    updateFormState({
      scannedBarcode: cleanBarcode,
      showScannerModal: false,
    });

    dispatch(fetchBookByISBNThunk(cleanBarcode));
  };

  const handleManualBarcodeEntry = () => {
    if (!scannedBarcode) {
      message.error(t("Please enter a valid barcode"));
      return;
    }
    if (!/^(97[89]\d{10}|\d{10})$/.test(scannedBarcode)) {
      message.error(t("Invalid barcode format"));
      return;
    }
    dispatch(fetchBookByISBNThunk(scannedBarcode));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scannedBarcode);
    updateFormState({ copied: true });
    setTimeout(() => updateFormState({ copied: false }), 2000);
    toast.success(t("Barcode copied to clipboard"));
  };

  const continueWithoutBarcode = () => {
    setInitialScanComplete(true);
    updateFormState({
      scannedBarcode: "",
    });
  };

  // Determine if we should show scan mode
  const shouldShowScanMode = !book && !initialScanComplete;

  return (
    <>
      {shouldShowScanMode ? (
        <ScanModeView
          onShowScannerModal={() => updateFormState({ showScannerModal: true })}
          scannedBarcode={scannedBarcode}
          onScannedBarcodeChange={(e) =>
            updateFormState({
              scannedBarcode: e.target.value.replace(/\D/g, ""),
            })
          }
          onCopyToClipboard={copyToClipboard}
          copied={copied}
          onManualBarcodeEntry={handleManualBarcodeEntry}
          isbnLoading={isbnLoading}
          onContinueWithoutBarcode={continueWithoutBarcode}
        />
      ) : (
        <BookFormView
          scannedBarcode={scannedBarcode}
          googleBookData={googleBookData}
          onToggleScanMode={() => {
            setInitialScanComplete(false);
            updateFormState({
              scannedBarcode: "",
            });
          }}
          onHideGoogleData={() => updateFormState({ googleBookData: null })}
          imageKey={imageKey}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onRemoveImage={handleRemoveImage}
          bookData={bookData}
          onInputChange={handleInputChange}
          onClassChange={(value) =>
            updateFormState({
              bookData: { ...bookData, class: value },
            })
          }
          onCategoriesChange={(value) =>
            updateFormState({
              bookData: { ...bookData, categories: value },
            })
          }
          errors={errors}
          classList={classList}
          categoriesList={categoriesList}
          onSubmit={handleSubmit}
          loading={loading}
          book={book}
        />
      )}

      <BookScannerModal
        visible={showScannerModal}
        onClose={() => updateFormState({ showScannerModal: false })}
        onScanComplete={handleScanComplete}
      />
    </>
  );
};

export default BookForm;
