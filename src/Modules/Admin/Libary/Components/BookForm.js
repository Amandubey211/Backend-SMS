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

/* helper: download URL ➜ File (for FormData upload) */
const urlToFile = async (url, filename = "cover.jpg") => {
  // force https and strip protocol for the proxy
  const clean = url.replace(/^https?:\/\//, "");
  const proxied = `https://images.weserv.nl/?url=${encodeURIComponent(clean)}`;

  try {
    const res = await fetch(proxied, { mode: "cors" });
    if (!res.ok) throw new Error("proxy fetch failed");
    const blob = await res.blob();
    const type = blob.type || "image/jpeg";
    return new File([blob], filename, { type });
  } catch (err) {
    console.warn("Thumbnail fetch failed, falling back to URL:", err);
    return null; // caller will handle null (no File)
  }
};

const BookForm = ({ book, onClose, setSidebarTitle }) => {
  const { t } = useTranslation("admLibrary");
  const dispatch = useDispatch();
  const classList = useSelector((s) => s.admin.class.classes);

  const {
    library: {
      categories: categoriesList,
      addbookloading: loading,
      addBookSuccess: success,
      isbnLoading,
      isbnBookData,
    },
  } = useSelector((s) => s.admin);

  /* ───────────────── local state ───────────────── */
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

  const [manualEntryMode, setManualEntryMode] = useState(false);

  const {
    bookData,
    imagePreview,
    errors,
    imageKey,
    scannedBarcode,
    googleBookData,
    existingBook,
  } = formState;

  const updateFormState = (u) => setFormState((p) => ({ ...p, ...u }));

  /* ───────────────── helpers ───────────────── */
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
    setManualEntryMode(false);
    setSidebarTitle?.(t("Add New Book"));
  };

  const handleContinueWithoutISBN = () => {
    setManualEntryMode(true);
    setSidebarTitle?.(t("Add New Book (Manual Entry)"));
  };

  /* ───────────────── effects ───────────────── */
  useEffect(() => {
    if (book) {
      const cats = Array.isArray(book.categories)
        ? book.categories.map((c) => c._id || c)
        : [];
      setFormState((prev) => ({
        ...prev,
        bookData: {
          bookName: book.name || "",
          authorName: book.author || "",
          class: book.classId?._id || book.classId || null,
          categories: cats,
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

  /* when thunk resolves */
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
  }, [isbnBookData, scannedBarcode, isbnLoading]);

  /* ───────────────── scan / manual entry ───────────────── */
  const handleScanComplete = (raw) => {
    const clean = raw.replace(/\D/g, "");
    if (!/^(97[89]\d{10}|\d{10})$/.test(clean)) {
      toast.error(t("Invalid barcode format"));
      return;
    }
    updateFormState({ scannedBarcode: clean });
    dispatch(fetchBookByISBNThunk(clean));
  };

  const handleManualBarcodeEntry = (v) => {
    if (!v) return message.error(t("Please enter a valid barcode"));
    if (!/^(97[89]\d{10}|\d{10})$/.test(v))
      return message.error(t("Invalid barcode format"));
    handleScanComplete(v);
  };

  /* ───────────────── exist / new handlers ───────────────── */
  const handleExistingBook = (bk) => {
    setSidebarTitle?.(t("Edit Book Copies"));
    setFormState((p) => ({
      ...p,
      existingBook: bk,
      bookData: {
        ...p.bookData,
        bookName: bk.name || "",
        authorName: bk.author || "",
        class: bk.classId?._id || bk.classId || null,
        categories: bk.categories?.map((c) => c._id) || [],
        copies: "1",
        barcodeValue: scannedBarcode,
        language: bk.language || "English",
      },
      imagePreview: bk.image || null,
    }));
  };

  /* NEW: fetch thumbnail, convert to File, attach */
  const handleNewBookFromGoogle = (payload) => {
    toast(t("New book detected from Google Books. Please verify details."), {
      icon: "ℹ️",
    });

    // try to proxy-fetch the image; if it fails we still keep the URL
    if (payload.book.image) {
      urlToFile(payload.book.image).then((file) => {
        if (file) {
          setFormState((prev) => ({
            ...prev,
            bookData: { ...prev.bookData, bookImage: file },
            imagePreview: URL.createObjectURL(file),
          }));
        } else {
          // fallback: just keep remote URL for preview
          setFormState((prev) => ({
            ...prev,
            imagePreview: payload.book.image,
          }));
        }
      });
    }

    updateFormState({
      bookData: {
        ...bookData,
        bookName: payload.book.name || "",
        authorName: payload.book.author || "",
        barcodeValue: scannedBarcode,
        copies: "1",
        language: payload.book.language || "English",
        // bookImage will be injected above if fetch succeeds
      },
      googleBookData: payload.googleData,
      imagePreview: payload.book.image || null,
    });
  };

  const handleBookNotFound = () => {
    toast(
      t("No book found with this barcode. Please enter details manually."),
      { icon: "⚠️" }
    );
    updateFormState({
      bookData: { ...bookData, barcodeValue: scannedBarcode, copies: "1" },
    });
  };

  /* ───────────────── form field handlers ───────────────── */
  const handleInputChange = ({ target: { name, value } }) =>
    updateFormState({
      bookData: { ...bookData, [name]: value },
      errors: { ...errors, [name]: undefined },
    });

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => updateFormState({ imagePreview: reader.result });
    reader.readAsDataURL(f);
    updateFormState({ bookData: { ...bookData, bookImage: f } });
  };

  const handleRemoveImage = () =>
    updateFormState({
      bookData: { ...bookData, bookImage: null },
      imagePreview: null,
      imageKey: Date.now(),
    });

  /* ───────────────── submit helpers ───────────────── */
  const validateForm = () => {
    const errs = {};
    if (!bookData.bookName.trim()) errs.bookName = t("Book name is required.");
    if (!bookData.authorName.trim())
      errs.authorName = t("Author name is required.");
    if (!bookData.categories.length)
      errs.categories = t("At least one category is required.");
    if (Number(bookData.copies) < 1)
      errs.copies = t("Copies must be at least 1.");
    updateFormState({ errors: errs });
    return !Object.keys(errs).length;
  };

  const createFormData = () => {
    const total = existingBook
      ? (
          parseInt(existingBook.copies || 0, 10) +
          parseInt(bookData.copies || 0, 10)
        ).toString()
      : bookData.copies;

    const fd = new FormData();
    fd.append("name", bookData.bookName);
    fd.append("author", bookData.authorName);
    fd.append("classId", bookData.class || "");
    bookData.categories.forEach((c) => fd.append("categories", c));
    fd.append("copies", total);
    fd.append("language", bookData.language || "English");
    if (bookData.bookImage) fd.append("image", bookData.bookImage);
    if (bookData.barcodeValue) fd.append("barcodeValue", bookData.barcodeValue);
    return fd;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const fd = createFormData();

    if (existingBook) {
      dispatch(
        updateBookThunk({ bookId: existingBook._id, formData: fd })
      ).then(() => onClose());
    } else if (book) {
      dispatch(updateBookThunk({ bookId: book._id, formData: fd })).then(() =>
        onClose()
      );
    } else {
      dispatch(addBookThunk(fd));
    }
  };

  /* ───────────────── counters ───────────────── */
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

  /* ───────────────── render branches ───────────────── */
  if (existingBook) {
    return (
      <BookFoundView
        book={existingBook}
        copies={bookData.copies}
        onCancel={() =>
          updateFormState({ scannedBarcode: "", existingBook: null })
        }
        onIncrement={handleIncrementCopy}
        onDecrement={handleDecrementCopy}
        onSubmit={handleSubmit}
        loading={loading}
      />
    );
  }

  if (!book && !scannedBarcode && !manualEntryMode) {
    return (
      <ScanModeView
        onScanComplete={handleScanComplete}
        onManualBarcodeEntry={handleManualBarcodeEntry}
        isbnLoading={isbnLoading}
        onContinueWithoutBarcode={handleContinueWithoutISBN}
      />
    );
  }

  return (
    <BookFormView
      manualEntryMode={manualEntryMode}
      scannedBarcode={scannedBarcode}
      googleBookData={googleBookData}
      onToggleScanMode={() => {
        setManualEntryMode(false);
        updateFormState({ scannedBarcode: "", existingBook: null });
      }}
      onHideGoogleData={() => updateFormState({ googleBookData: null })}
      imageKey={imageKey}
      imagePreview={imagePreview}
      onImageChange={handleImageChange}
      onRemoveImage={handleRemoveImage}
      bookData={bookData}
      onInputChange={handleInputChange}
      onClassChange={(v) =>
        updateFormState({ bookData: { ...bookData, class: v } })
      }
      onCategoriesChange={(v) =>
        updateFormState({ bookData: { ...bookData, categories: v } })
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
