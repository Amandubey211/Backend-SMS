import React, { useEffect } from "react";
import AdminDashLayout from "../../../../Components/Admin/AdminDashLayout";
import CardsSection from "./CardsSection";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import { FiPlus, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import RecentInvoice from "./Components/RecentInvoice.table";
import ReturnInvoice from "./Components/ReturnInvoice.table";
import Layout from "../../../../Components/Common/Layout";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoice, fetchInvoiceCard } from "../../../../Store/Slices/Finance/Invoice/invoice.thunk";
import { FaPlusCircle } from "react-icons/fa";
import { setInvoiceData } from "../../../../Store/Slices/Finance/Invoice/invoiceSlice";
import ProtectedSection from "../../../../Routes/ProtectedRoutes/ProtectedSection";
import { PERMISSIONS } from "../../../../config/permission";
import ProtectedAction from "../../../../Routes/ProtectedRoutes/ProtectedAction";

const InvoicesMain = () => {
    useNavHeading("Finance", "Invoices");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    useEffect(()=>{
     dispatch(fetchInvoice({}))
     dispatch(fetchInvoiceCard({}))
    },[dispatch])
    return (
        <Layout title="Finance | Invoice">
        <AdminDashLayout>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-4 justify-start items-center">
                    </div>
                    <ProtectedAction  requiredPermission={PERMISSIONS.CREATE_NEW_INVOICE}>
                    <button
                       onClick={() => {dispatch(setInvoiceData());navigate('/finance/invoices/add-new-invoice')}}
                        className="inline-flex items-center border border-gray-300 rounded-full ps-4 bg-white hover:shadow-lg transition duration-200 gap-2"
                    >
                        <span className="text-gray-800 font-medium">Add New Invoice</span>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
                    
                             <FiPlus size={16} />
                        </div>
                    </button>
                    </ProtectedAction>
                </div>
                <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_CARD_DATA_OF_INVOICE} title={'Invoice Cards'}>
                <CardsSection />
                </ProtectedSection>
                <ProtectedSection requiredPermission={PERMISSIONS.SHOWS_RECENT_AND_RETURN_INVOICE} title={"Recent Invoice List"}>
                <RecentInvoice />                
                <ReturnInvoice />     
                </ProtectedSection>           
            </div>
            
        </AdminDashLayout>
        </Layout>
    );
};

export default InvoicesMain;
