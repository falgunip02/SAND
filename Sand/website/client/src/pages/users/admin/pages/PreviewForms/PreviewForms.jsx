import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { connect, useSelector } from "react-redux";
import axios from "axios";
import { setFullNameData } from "../AdminCreateForm/FormUtils/elements/FormFields/actions/fullNameActions";
import Heading from "../AdminCreateForm/FormUtils/elements/FormFields/Heading/Heading";
import FullName from "../AdminCreateForm/FormUtils/elements/FormFields/FullName/FullName";
import Email from "../AdminCreateForm/FormUtils/elements/FormFields/Email/Email";
import Address from "../AdminCreateForm/FormUtils/elements/FormFields/Address/Address";
import DatePicker from "../AdminCreateForm/FormUtils/elements/FormFields/DatePicker/DatePicker";
import ShortText from "../AdminCreateForm/FormUtils/elements/FormFields/ShortText/ShortText";
import LongText from "../AdminCreateForm/FormUtils/elements/FormFields/LongText/LongText";
import DropDown from "../AdminCreateForm/FormUtils/elements/FormFields/DropDown/DropDown";
import NormalDropDown from "../AdminCreateForm/FormUtils/elements/FormFields/NormalDropDown/NormalDropDown";
import SingleChoice from "../AdminCreateForm/FormUtils/elements/FormFields/SingleChoice/SingleChoice";
import MultipleChoice from "../AdminCreateForm/FormUtils/elements/FormFields/MultipleChoice/MultipleChoice";
import Number from "../AdminCreateForm/FormUtils/elements/FormFields/Number/Number";
import Image from "../AdminCreateForm/FormUtils/elements/FormFields/Image/Image";
import FileUpload from "../AdminCreateForm/FormUtils/elements/FormFields/FileUpload/FIleUpload";
import StarRating from "../AdminCreateForm/FormUtils/elements/FormFields/StarRating/StarRating";
import ScaleRating from "../AdminCreateForm/FormUtils/elements/FormFields/ScaleRating/ScaleRating";
import Table from "../AdminCreateForm/FormUtils/elements/FormFields/Table/Table";
import Phone from "../AdminCreateForm/FormUtils/elements/FormFields/Phone/Phone";
import Appointment from "../AdminCreateForm/FormUtils/elements/FormFields/Appointment/Appointment";
import PageTitle from "../../../../../components/PageTitles/PageTitle";

import './PreviewForms.css';

const componentsMap = [
  { id: "1", text: "Heading", component: Heading, title: "" },
  { id: "2", text: "Full Name", component: FullName, title: "" },
  { id: "3", text: "Email", component: Email, title: "" },
  { id: "4", text: "Address", component: Address, title: "" },
  { id: "5", text: "Phone", component: Phone, title: "" },
  { id: "6", text: "Date Picker", component: DatePicker, title: "" },
  { id: "7", text: "Appointment", component: Appointment, title: "" },
  { id: "8", text: "Short Text", component: ShortText, title: "" },
  { id: "9", text: "Long Text", component: LongText, title: "" },
  { id: "10", text: "Drop Down", component: DropDown, title: "" },
  { id: "11", text: "Normal Drop Down", component: NormalDropDown, title: "" },
  { id: "12", text: "Single Choice", component: SingleChoice, title: "" },
  { id: "13", text: "Multiple Choice", component: MultipleChoice, title: "" },
  { id: "14", text: "Number", component: Number, title: "" },
  { id: "15", text: "Image", component: Image, title: "" },
  // { id: "16", text: "File Upload", component: FileUpload, title: "" },
  { id: "17", text: "Star Rating", component: StarRating, title: "" },
  { id: "18", text: "Scale Rating", component: ScaleRating, title: "" },
  { id: "19", text: "Table", component: Table, title: "" },
];


const FormPreview = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState([]);

  const fullNameDataList = useSelector(
    (state) => state.fullName.fullNameDataList
  );




  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch("https://sand-backend-kwqd.onrender.com/api/v1/promoter/fetchFormField", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId }),
        });

        const data = await response.json();

        if (data?.data?.length > 0 && data.data[0].formFields) {
          setFormData(data.data[0].formFields);
        } else {
          setFormData([]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formId]);



  return (
    <div className="preview-form-container">
      <PageTitle title="Preview Form"></PageTitle>
      <DndProvider backend={HTML5Backend}>
        <div className="preview-form-content">
          <div className="preview-form-box">
            <div className="preview-form-box-container">



              {formData.map((field) => {
                if (field.type === "Form Title") {
                  return <h1 className="formTitle" key={field.uniqueId}>{field.title}</h1>;
                }

                const componentEntry = componentsMap.find((c) => c.text === field.type);
                const Component = componentEntry ? componentEntry.component : null;

                return Component ? (
                  <Component
                    key={field.uniqueId}
                    setFullNameData={setFullNameData}
                    fullNameDataList={fullNameDataList}
                    formField={field} // Pass the formField object
                    {...field}
                  />
                ) : (
                  <div key={field.uniqueId}>Unknown component type: {field.type}</div>
                );
              })}

            </div>

          </div>
        </div>




        


      </DndProvider>

    </div>
  );
};

const mapStateToProps = (state) => ({
  fullNameDataList: state.fullName.fullNameDataList,
});

export default connect(mapStateToProps)(FormPreview);
