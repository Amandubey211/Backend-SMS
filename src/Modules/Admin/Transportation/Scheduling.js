import React, { useState } from 'react'
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";
import { useTranslation } from "react-i18next";
import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import ScheduleList from '../../../Components/Transportation/ScheduleList';

const Scheduling = () => {
    const { t } = useTranslation("transportation");
    useNavHeading(t("Transportation"), t("Schedule"));

    return (
        <Layout title={t("Schedule") + " | Student diwan"}>
            <DashLayout>
                <div className="p-5">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold mb-4">Schedule</h1>
                        <div className="mb-4 flex gap-4">
                        </div>
                    </div>
                    <ScheduleList />
                </div>
            </DashLayout>
        </Layout>
    )
}

export default Scheduling