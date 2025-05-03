import React from 'react'
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from "react-i18next";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";

const Scheduling = () => {
    const { t } = useTranslation("transportation");
    useNavHeading(t("Transportation"), t("Schedule"));

    return (
        <Layout title={t("Shift Management") + " | Student diwan"}>
            <DashLayout>
                <div className="p-5">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold mb-4">Shift Management</h1>
                        <div className="mb-4 flex gap-4">
                            <button
                                onClick={handleCreateNew}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Add Shift
                            </button>
                        </div>
                    </div>
                </div>
            </DashLayout>
        </Layout>
    )
}

export default Scheduling