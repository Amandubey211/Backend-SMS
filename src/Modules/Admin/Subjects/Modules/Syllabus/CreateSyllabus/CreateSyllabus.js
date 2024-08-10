import React, { useState, useEffect } from "react";
import Layout from "../../../../../../Components/Common/Layout";
import MainSection from "./MainSection";

const CreateSyllabus = () => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // This effect can be used to perform side effects when isEditing changes, if needed.
  }, [isEditing]);

  return (
    <div>
      <Layout
        title={
          isEditing
            ? `Update Syllabus | Student Diwan`
            : `Create Syllabus | Student Diwan`
        }
      >
        <MainSection setIsEditing={setIsEditing} />
      </Layout>
    </div>
  );
};

export default CreateSyllabus;
