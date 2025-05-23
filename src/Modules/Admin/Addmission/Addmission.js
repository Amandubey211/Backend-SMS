import Layout from "../../../Components/Common/Layout";
import DashLayout from "../../../Components/Admin/AdminDashLayout";
import { useTranslation } from "react-i18next";
import StudentInfo from "./StudentInfo";
import useNavHeading from "../../../Hooks/CommonHooks/useNavHeading ";

const Addmission = () => {
  const { t } = useTranslation("admAdmission");
  useNavHeading(t("Admin"), t("Student Admission"));

  return (
    <Layout title="Admission | Student diwan">
      <DashLayout children={<StudentInfo />} />
    </Layout>
  );
};

export default Addmission;
