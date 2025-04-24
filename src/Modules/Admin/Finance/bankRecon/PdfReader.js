import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReceiptsReconciliation, updateReceipt } from '../../../../Store/Slices/Finance/Receipts/receiptsThunks';
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel, MdFindInPage } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import toast from 'react-hot-toast';
import BankReconciliationSummary from './BankReconciliationSummary';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFSearchViewer = () => {
  const schoolCurrency = useSelector((store) => store.common.user.userDetails?.currency);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .highlight {
        background-color: #ffeb3b;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: bold;
        color: #000;
        box-shadow: 0 0 3px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [pdfFile, setPdfFile] = useState(null);
  const [File, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [keywords, setKeywords] = useState({ word1: '', word2: '' });
  const [allPdfText, setAllPdfText] = useState([]);
  const [allReceipts, setAllReceipts] = useState([]);
  const [updateReceiptData, setUpdateReceiptData] = useState({
    verifyFromBank: '',
    adjustmentAmount: 0,
    reason: '',
    receiptId: null
  });
  const dispatch = useDispatch()
  const containerRef = useRef(null);
  useEffect(() => {
    dispatch(fetchAllReceiptsReconciliation({ page: 1, limit: 1000, pending: 'yes' })).then((action) => {
      setAllReceipts(action?.payload?.data)
    })
  }, [])
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file, file.type);

    if (file && file.type === 'application/pdf') {
      const objectUrl = URL.createObjectURL(file);
      setPdfFile(objectUrl);
      setNumPages(null);
      setFile(file)
      extractTextFromPDF(file)
    }
  };


  // const extractTextFromPDF = async (file) => {
  //   const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
  //   const pdf = await loadingTask.promise;
  //   const textLines = [];

  //   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  //     const page = await pdf.getPage(pageNum);
  //     const textContent = await page.getTextContent();

  //     const lineMap = new Map();

  //     textContent.items.forEach((item) => {
  //       const y = Math.floor(item.transform[5]); // Y position
  //       const existingLine = lineMap.get(y) || [];
  //       existingLine.push(item.str);
  //       lineMap.set(y, existingLine);
  //     });

  //     const sortedLines = Array.from(lineMap.entries())
  //       .sort((a, b) => b[0] - a[0])
  //       .map(([_, words]) => words.join(' '));

  //     textLines.push(...sortedLines);
  //   }
  //   let findTransactions = []
  //   textLines?.map((item) => {


  //     let firstWord = item?.split(' ');


  //     if (firstWord?.length > 0) {
  //       if (firstWord[0]?.split('-').length == 3 && firstWord.length > 12) {
  //         console.log(firstWord[0]?.split('-'));
  //         findTransactions.push(item)
  //       }
  //     }
  //   })


  //   const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
  //   let result = [];

  //   findTransactions?.forEach((entry, index) => {
  //     const parts = entry.split(' ');
  //     const date = parts[0];



  //     const matches = entry.match(regex);
  //     if (matches && matches.length >= 2) {
  //       const amount = parseFloat(matches[matches?.length - 2].replace(',', ''));
  //       const balance = parseFloat(matches[matches?.length - 1].replace(',', ''));
  //       let d = entry?.split(' ');
  //       d = d?.slice(1, d.length - 2);
  //       result.push({
  //         date,
  //         description: d,
  //         amount: Number(amount),
  //         balance: Number(balance),
  //       });
  //     }
  //   });
  //   result = result.map((i, index) => {
  //     return {
  //       date: i.date,
  //       description: i.description,
  //       amount: i.amount,
  //       balance: i.balance,
  //       Type: result[index - 1]?.balance < i?.balance ? "Credit" : "Debit"
  //     }
  //   })
  //   setAllPdfText(result);
  //   return textLines;
  // };


  const extractTextFromPDF = async (file) => {
    const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));
    const pdf = await loadingTask.promise;
    const textLines = [];
  
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
  
      const lineMap = new Map();
  
      textContent.items.forEach((item) => {
        // ✅ Fix: Normalize Y position to tolerate macOS/Windows differences
        const y = Math.round(item.transform[5]); // Changed from Math.floor
        const existingLine = lineMap.get(y) || [];
        existingLine.push(item.str);
        lineMap.set(y, existingLine);
      });
  
      const sortedLines = Array.from(lineMap.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([_, words]) => words.join(' '));
  
      textLines.push(...sortedLines);
    }
  
    let findTransactions = [];
    textLines?.map((item) => {
      let firstWord = item?.split(' ');
  
      if (firstWord?.length > 0) {
        if (firstWord[0]?.split('-').length === 3 && firstWord.length > 12) {
          console.log(firstWord[0]?.split('-'));
          findTransactions.push(item);
        }
      }
    });
  
    const regex = /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    let result = [];
  
    findTransactions?.forEach((entry, index) => {
      const parts = entry.split(' ');
      const date = parts[0];
      const matches = entry.match(regex);
  
      if (matches && matches.length >= 2) {
        const amount = parseFloat(matches[matches.length - 2].replace(',', ''));
        const balance = parseFloat(matches[matches.length - 1].replace(',', ''));
        let d = entry?.split(' ');
        d = d?.slice(1, d.length - 2);
        result.push({
          date,
          description: d,
          amount: Number(amount),
          balance: Number(balance),
        });
      }
    });
  
    result = result.map((i, index) => {
      return {
        date: i.date,
        description: i.description,
        amount: i.amount,
        balance: i.balance,
        Type: result[index - 1]?.balance < i?.balance ? "Credit" : "Debit",
      };
    });
  
    setAllPdfText(result);
    return textLines;
  };
  

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;

    // Try to parse using built-in Date first
    let parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate)) return parsedDate.toISOString().split("T")[0];

    // Fallback for custom formats like '12-Mar-2023', '12/03/2023', etc.
    const formats = [
      { regex: /^(\d{1,2})[-/](\w{3})[-/](\d{2,4})$/, format: "DD-MMM-YYYY" },
      { regex: /^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/, format: "DD-MM-YYYY" },
      { regex: /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/, format: "YYYY-MM-DD" },
    ];

    for (const fmt of formats) {
      const match = dateStr.match(fmt.regex);
      if (match) {
        try {
          let [_, d1, d2, d3] = match;

          if (fmt.format === "DD-MMM-YYYY") {
            const monthMap = {
              Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
              Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
            };
            const day = parseInt(d1);
            const month = monthMap[d2];
            const year = d3.length === 2 ? 2000 + parseInt(d3) : parseInt(d3);
            const finalDate = new Date(Date.UTC(year, month, day));
            return finalDate.toISOString().split("T")[0];
          }

          if (fmt.format === "DD-MM-YYYY") {
            const day = parseInt(d1);
            const month = parseInt(d2) - 1;
            const year = d3.length === 2 ? 2000 + parseInt(d3) : parseInt(d3);
            const finalDate = new Date(Date.UTC(year, month, day));
            return finalDate.toISOString().split("T")[0];
          }

          if (fmt.format === "YYYY-MM-DD") {
            return `${d1.padStart(4, '0')}-${d2.padStart(2, '0')}-${d3.padStart(2, '0')}`;
          }
        } catch (err) {
          return null;
        }
      }
    }

    return null; // If all fails
  };



  const handleSearch = (receipt) => {
    const receiptDate = normalizeDate(receipt?.date);
    const receiptAmount = receipt?.amount;
    let matched = [];
    allPdfText.map((txn) => {
      const txnDate = normalizeDate(txn?.date);
      const txnAmount = txn?.amount;

      const ndate = new Date(txnDate);
      ndate.setDate(ndate.getDate() + 1);
      const nextDayStr = ndate.toISOString().split('T')[0];
      if (nextDayStr?.toString() == receiptDate?.toString()) {
        if (txnAmount.toFixed(2) == receiptAmount.toFixed(2)) {
          matched.push({ ...txn, match: 'yes' })
        } else {
          matched.push(txn)
        }
      }
    });

    if (matched?.length >= 1) {
      return setAllPdfText(matched);

    } else {
      return setAllPdfText([]);
    }
  };

  const handleSubmit = async () => {
    if (updateReceiptData.verifyFromBank == "verified") {
      await dispatch(updateReceipt(updateReceiptData))
    }
    if (updateReceiptData.verifyFromBank == "reject") {
      if (!updateReceiptData.reason) {
        return toast.error("Please Enter Reason")
      }
      await dispatch(updateReceipt(updateReceiptData))
    }
    if (updateReceiptData.verifyFromBank == "resolved") {
      if (!updateReceiptData?.reason || updateReceiptData?.adjustmentAmount == 0) {
        return toast.error("Please Enter Amount & Reason")
      }
      await dispatch(updateReceipt(updateReceiptData))
    }
    dispatch(fetchAllReceiptsReconciliation({ page: 1, limit: 1000, pending: 'yes' })).then((action) => {
      setAllReceipts(action?.payload?.data)
    })
    return
  }

  return (<>
    <div className="p-4  flex  gap-2 flex-row">

      <div className='w-[65%] '>

        <div className="flex flex-row justify-between items-center gap-3 mt-2 mb-2 py-2">
          <div className='flex flex-row justify-between items-center gap-5'>
            {!File ? <p class="text-gray-800">
              Upload your bank statement to begin reconciliation
            </p> : null}
            {File ?<div className="relative w-fit">
              <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="opacity-0 absolute inset-0 w-full h-full z-10 cursor-pointer"
            />
            <div className="border rounded px-3 py-1 text-sm text-gray-500 bg-white pointer-events-none">
              Upload New File
            </div></div>: null}
          </div>
          {File ? <button onClick={() => extractTextFromPDF(File)} className='flex flex-row items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded-lg shadow-lg'>Show All</button> : null}
        </div>

        <div
          ref={containerRef}
          className="overflow-y-scroll w-full border rounded shadow-inner pl-2"
          style={{ height: '80vh' }}
        >
          {!File ? (
            <label
              htmlFor="pdfUpload"
              className="flex flex-col items-center justify-center w-full h-[60vh] border-4 border-dashed border-purple-300 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <MdFindInPage size={60} className="text-purple-400" />
                <p className="text-xl font-semibold text-gray-700">Upload or drag your bank statement here</p>
                <p className="text-sm text-gray-500">(PDF only)</p>
              </div>
              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <table className="table-auto w-full border-collapse border rounded-lg border-gray-300 ">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                </tr>
              </thead>


              <tbody>
                {allPdfText?.length < 1 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No Transaction Found!
                    </td>
                  </tr>
                )}
                {allPdfText?.map((i, index) => (
                  <tr key={index} className={i?.match == 'yes' ? 'bg-purple-300' : ''}>
                    <td className="border border-gray-300 px-4 py-2">{i?.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{i?.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{i?.Type}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {i?.description?.map((d, idx) => (
                        <span key={idx}>{d} </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pdfFile && (
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="w-full"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="px-4 py-2"
                />
              ))}
            </Document>
          )}


        </div>
      </div>
      <div className='w-[35%] h-80vh mt-16 overflow-y-scroll p-2' style={{ height: '80vh' }}>
        <div className='' >
          {allReceipts?.map((r) => {
            const totalAmount = r.paidItems.reduce((sum, item) => sum + item.amountPaid, 0);

            const isSelected = (type) => updateReceiptData?.receiptId === r._id && updateReceiptData?.verifyFromBank === type;

            const handleChange = (field, value) => {
              setUpdateReceiptData((prev) => ({
                ...prev,
                [field]: value,
                receiptId: r._id
              }));
            };

            return (
              <>
                <div
                  className={`flex flex-row relative justify-around px-5 py-5 rounded-lg w-full h-auto mb-2 cursor-pointer ${isSelected("verified") || isSelected("reject") || isSelected("resolved")
                    ? "bg-purple-400"
                    : "bg-purple-300"
                    }`}
                >
                  <div className="flex flex-col gap-2 ">
                    <div className='absolute top-1 left-1 shadow-lg' onClick={async () => {
                      handleSearch({
                        date: r?.paymentDate?.slice(0, 10),
                        amount: totalAmount
                      });
                    }}>
                      <MdFindInPage size={24} color='white' />
                    </div>
                    <p className="font-bold">
                      Date: <span className="font-semibold text-gray-800">{r?.paymentDate?.slice(0, 10)}</span>
                    </p>
                    <p>Amount: {totalAmount} {schoolCurrency}</p>
                    <p>Paid By: {r?.paidBy}</p>
                    <p>Payment Type: {r?.paymentType}</p>
                    {r?.chequeNumber && <p>Cheque Number: {r?.chequeNumber}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className={`border flex items-center justify-center flex-row p-1 gap-2 rounded-lg ${isSelected("verified") ? "bg-green-200" : ""
                        }`}
                      onClick={() => handleChange("verifyFromBank", "verified")}
                    >
                      <FaCheckCircle size={20} color="green" /> Verified
                    </button>
                    <button
                      className={`border flex items-center justify-center flex-row p-1 gap-2 rounded-lg ${isSelected("reject") ? "bg-red-200" : ""
                        }`}
                      onClick={() => handleChange("verifyFromBank", "reject")}
                    >
                      <MdCancel size={20} color="red" /> Reject
                    </button>
                    <button
                      className={`border flex items-center justify-center flex-row p-1 gap-2 rounded-lg ${isSelected("resolved") ? "bg-blue-200" : ""
                        }`}
                      onClick={() => handleChange("verifyFromBank", "resolved")}
                    >
                      <IoCheckmarkDoneCircle size={20} color="blue" /> Adjust
                    </button>
                  </div>
                </div>

                {updateReceiptData?.receiptId === r._id && (
                  <div className="flex flex-col gap-2 mb-10">
                    {updateReceiptData.verifyFromBank === "resolved" && (
                      <>
                        <label className="text-sm font-semibold text-gray-700">Adjustment Amount</label>
                        <input
                          type="number"
                          placeholder="Enter Adjustment Amount"
                          className="w-full h-[3rem] border border-purple-600 rounded-lg p-2"
                          value={updateReceiptData.adjustmentAmount}
                          onChange={(e) => handleChange("adjustmentAmount", Number(e.target.value))}
                        />
                        <label className="text-sm font-semibold text-gray-700">Reason</label>
                        <input
                          type="text"
                          placeholder="Reason"
                          className="w-full h-[3rem] border border-purple-600 rounded-lg p-2"
                          value={updateReceiptData.reason}
                          onChange={(e) => handleChange("reason", e.target.value)}
                        />
                      </>
                    )}

                    {updateReceiptData.verifyFromBank === "reject" && (
                      <>
                        <label className="text-sm font-semibold text-gray-700">Reason</label>
                        <input
                          type="text"
                          placeholder="Reason"
                          className="w-full h-[3rem] border border-purple-600 rounded-lg p-2"
                          value={updateReceiptData.reason}
                          onChange={(e) => handleChange("reason", e.target.value)}
                        />
                      </>
                    )}

                    <button
                      className="w-full h-[3rem] border border-purple-600 rounded-lg p-2 bg-purple-500 text-white"
                      onClick={handleSubmit}
                    >
                      Confirm
                    </button>
                    <button
                      className="w-full h-[3rem] border border-purple-600 rounded-lg p-2 bg-white text-black"
                      onClick={() => setUpdateReceiptData({
                        verifyFromBank: '',
                        adjustmentAmount: 0,
                        reason: '',
                        receiptId: null
                      })}
                    >
                      Cancel
                    </button>

                    <p className="text-red-500 flex flex-row justify-center items-center gap-2">
                      <IoIosWarning />! Once submitted, it cannot be updated or removed.
                    </p>
                  </div>
                )}
              </>
            );
          })}


        </div>

      </div>

    </div>
    <div className="w-full mt-6 p-4">
      <BankReconciliationSummary />
    </div>
  </>
  );
};

export default PDFSearchViewer;
