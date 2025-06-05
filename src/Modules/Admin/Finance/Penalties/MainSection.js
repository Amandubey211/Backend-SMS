import Layout from "../../../../Components/Common/Layout";
import useNavHeading from "../../../../Hooks/CommonHooks/useNavHeading ";
import DashLayout from "../../../../Components/Admin/AdminDashLayout";
import Penalties from "./Penalties";



const PenaltyMainSection = () => {
    useNavHeading("Admin",`Penalties`);

    return (
        <Layout title={`Penalties | Student diwan`}>
            <DashLayout children={<Penalties />} />
        </Layout>
    );
};

export default PenaltyMainSection;
