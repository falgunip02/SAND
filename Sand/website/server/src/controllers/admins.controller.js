const { Router } = require("express");
const userController = require("../controllers/users.controller");
const router = Router();
const apiResponse = require("../utils/apiResponse");
const apiError = require("../utils/apiError");
const uploadOnCloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const client = require("../models/client.model");
const campaign = require("../models/campaign.model");
const Promoter = require("../models/promoter.model");
const campaignRights = require("../models/campaignsRightSchema.model");
const FormFieldSchema = require("../models/forms.fields.model");
const asyncHandler = require("../utils/asyncHandler");
const formsFieldsModel = require("../models/forms.fields.model");
const User = require("../models/user.model");

//
const createNewClient = asyncHandler(async (req, res) => {
  try {
    const { clientName, clientLocation, clientWebsite } = req.body;
    console.log(clientName, clientLocation, clientWebsite);

    if (!clientName || !clientLocation || !clientWebsite) {
      throw new apiError(
        400,
        "Client name, location, and website are required"
      );
    }

    const clientPicFinalPath = req.files?.clientPhoto?.[0]?.path;

    if (!clientPicFinalPath) {
      throw new apiError(400, "Client Logo/Pic is required");
    }

    const clientPicFinal = await uploadOnCloudinary(clientPicFinalPath);
    if (!clientPicFinal) {
      throw new apiError(400, "Failed to upload client Photo");
    }

    const newClient = await client.create({
      clientName,
      clientLocation,
      clientWebsite,
      clientPhoto: clientPicFinal.url,
    });

    res
      .status(201)
      .json(new apiResponse(201, newClient, "Client created successfully"));
  } catch (error) {
    console.error("Error creating new client:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message ||
      "An error occurred while creating new client. Try again later."
    );
  }
});

const fetchNestedForms = asyncHandler(async (req, res) => {
  try {
    const { mainFormId } = req.body;

    if (!mainFormId) {
      throw new apiError(400, "mainFormId is required");
    }

    const mainForm = await FormFieldSchema.findById(mainFormId);
    if (
      !mainForm ||
      !mainForm.nestedForms    ) {
      throw new apiError(404, "Nested forms not found.");
    }

    const nestedFormsDetails = await FormFieldSchema.find({ _id: { $in: mainForm.nestedForms } });
    console.log(nestedFormsDetails);
    
    res
      .status(200)
      .json(new apiResponse(200, nestedFormsDetails, "Fetched forms successfull"));
  } catch (error) {
    console.error(error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "Internal Server Problem"
    );
  }
});

const fetchClient = asyncHandler(async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      throw new apiError(400, "Client ID is required");
    }

    const clientDoc = await client.findById(clientId);

    if (!clientDoc) {
      throw new apiError(400, "Client not found");
    }

    res
      .status(200)
      .json(new apiResponse(200, clientDoc, "Client fetched successfully"));
  } catch (error) {
    console.error("Error fetching client:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching client"
    );
  }
});

const fetchAllClients = asyncHandler(async (req, res) => {
  try {
    const clients = await client.find();
    res
      .status(200)
      .json(new apiResponse(200, clients, "Clients fetched successfully"));
  } catch (error) {
    console.error("Error fetching all clients:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching clients"
    );
  }
});

const deleteClient = asyncHandler(async (req, res) => {
  try {
    const { clientId } = req.body;
    console.log(clientId);

    if (!clientId) {
      throw new apiError(400, "Details are required to delete the client.");
    }

    const clientDoc = await client.findByIdAndDelete(clientId);

    if (!clientDoc) {
      throw new apiError(400, "No client found with the given id.");
    }

    return res
      .status(200)
      .json(new apiResponse(200, clientDoc, "Client deleted successfully."));
  } catch (error) {
    console.error("Error deleting clients:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while deleting the client."
    );
  }
});

const deleteCampaign = asyncHandler(async (req, res) => {
  try {
    const { campaignId } = req.body;
    console.log(campaignId);

    if (!campaignId) {
      return res
        .status(400)
        .json(
          new apiError(400, "Details are required to delete the campaign.")
        );
    }

    const campaignDoc = await campaign.findByIdAndDelete(campaignId);

    if (!campaignDoc) {
      throw new apiError(400, "No campaign found with the given id.");
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, campaignDoc, "Campaign deleted successfully.")
      );
  } catch (error) {
    console.error("Error deleting clients:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while deleting the client."
    );
  }
});

const fetchAllCampaigns = asyncHandler(async (req, res) => {
  try {
    const campaigns = await campaign.find({}).sort({ createdAt: -1 }).limit(4);
    res
      .status(200)
      .json(
        new apiResponse(
          200,
          campaigns,
          "Last 4 Campaigns Fetched Successfully."
        )
      );
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching campaigns"
    );
  }
});

const fetchAllClientSpecificCampaigns = asyncHandler(async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      throw new apiError(400, "Client ID is required");
    }

    const campaigns = await campaign.find({ clientId });
    if (!campaigns) {
      throw new apiError(400, "Failed to load the campaign");
    }
    res
      .status(200)
      .json(new apiResponse(200, campaigns, "Campaigns fetched successfully"));
  } catch (error) {
    console.error("Error fetching all campaigns:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching campaigns"
    );
  }
});

const fetchCampaignDetails = asyncHandler(async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      throw new apiError(400, "Campaign ID is required");
    }

    const campaignDoc = await campaign.findById(campaignId);

    if (!campaignDoc) {
      throw new apiError(404, "Campaign not found");
    }

    res
      .status(200)
      .json(new apiResponse(200, campaignDoc, "Campaign fetched successfully"));
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching campaign details"
    );
  }
});

//:TODO this has problem
const createNewForm = asyncHandler(async (req, res) => {
  try {
    const { campaignId, formFields } = req.body;

    // Validate required fields
    if (!campaignId || !formFields) {
      throw new apiError(400, "All data is required.");
    }

    // Validate formFields structure
    formFields.forEach((field) => {
      if (field.type === "dropdown" && !Array.isArray(field.options)) {
        throw new apiError(400, `Invalid options for field ${field.title}.`);
      }
    });

    const formName = formFields[0]?.title;
    if (!formName) {
      throw new apiError(400, "Form title is required.");
    }

    const campaignDetails = await campaign.findById(campaignId);
    if (!campaignDetails) {
      throw new apiError(404, "Campaign not found.");
    }

    const user = {
      campaignId,
      formFields,
      collectionName: formName,
      isThisNestedForm: false,
      mainFormId: null,
    };

    const newForm = await FormFieldSchema.create(user);
    if (!newForm) {
      throw new apiError(400, "Error occurred while creating form.");
    }

    await mongoose.connection.db.createCollection(formName);

    return res
      .status(200)
      .json(new apiResponse(201, newForm, "New Form Successfully Created."));
  } catch (error) {
    console.error(error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "Internal Server Problem"
    );
  }
});

// need to be worked on
const createNestedForm = asyncHandler(async (req, res) => {
  try {
    const { mainFormId, formFields } = req.body;
    const formName = formFields[0]["title"];

    if (!mainFormId || !formFields) {
      throw new apiError(400, "mainFormId and formFields are required");
    }

    const fetchFormDetails = await FormFieldSchema.findOne({ _id: mainFormId });
    if (!fetchFormDetails) {
      throw new apiError(404, "Form not found.");
    }

    const user = {
      campaignId: fetchFormDetails.campaignId,
      formFields,
      collectionName: formName,
      isThisNestedForm: true,
      mainFormId: mainFormId,
    };

    const newForm = await FormFieldSchema.create(user);
    await mongoose.connection.db.createCollection(formName);

    fetchFormDetails.nestedForms.push(newForm._id);
    await fetchFormDetails.save();
    console.log("finally created but message issue");

    return res
      .status(200)
      .json(new apiResponse(200, fetchFormDetails, "Form Details Fetched"));
  } catch (error) {
    console.error("Error creating new nested form :", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while creating new campaign"
    );
  }
});

const createNewCampaign = asyncHandler(async (req, res) => {
  try {
    const { title, clientId } = req.body;

    if (!title || !clientId) {
      throw new apiError(400, "Title and Client ID are required");
    }

    const campaignPicFinalPath = req.files?.campaignPhoto?.[0]?.path;

    if (!campaignPicFinalPath) {
      throw new apiError(400, "campaign Logo/picture is required");
    }

    const campaignPicFinal = await uploadOnCloudinary(campaignPicFinalPath);
    if (!campaignPicFinal) {
      throw new apiError(400, "Failed to upload campaign Photo");
    }

    const newCampaign = await campaign.create({
      title,
      clientId,
      campaignLogo: campaignPicFinal.url,
    });
    if (!newCampaign) {
      throw new apiError(400, "Failed to create campaign.");
    }

    res
      .status(201)
      .json(
        new apiResponse(201, newCampaign, "New campaign created successfully")
      );
  } catch (error) {
    console.error("Error creating new campaign:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while creating new campaign"
    );
  }
});

const assignCreatedForm = asyncHandler(async (req, res) => {
  try {
    const { formId, promoterId } = req.body;

    if (!formId || !promoterId) {
      throw new apiError(400, "Form ID and Promoter ID are required");
    }

    const promoter = await Promoter.findById(promoterId);

    if (!promoter) {
      throw new apiError(404, "Promoter not found");
    }

    promoter.forms = promoter.forms || [];
    promoter.forms.push(formId);

    await promoter.save();

    res
      .status(200)
      .json(new apiResponse(200, promoter, "Promoter details updated"));
  } catch (error) {
    console.error("Error assigning form to promoter:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while assigning the form"
    );
  }
});

const unassignCreatedForm = asyncHandler(async (req, res) => {
  try {
    const { formId, promoterId } = req.body;

    if (!formId || !promoterId) {
      throw new apiError(400, "Form ID and Promoter ID are required");
    }

    const promoter = await Promoter.findById(promoterId);

    if (!promoter) {
      throw new apiError(404, "Promoter not found");
    }

    promoter.forms = promoter.forms || [];
    promoter.forms.pop(formId);

    await promoter.save();

    res
      .status(200)
      .json(new apiResponse(200, promoter, "Promoter details updated"));
  } catch (error) {
    console.error("Error occur while unassigning form promoter:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while assigning the form"
    );
  }
});

// assign campaign to MIS
const assignCampaignToMis = asyncHandler(async (req, res) => {
  try {
    const { campaignId, misId } = req.body; // Allow multiple `misIds`

    if (!campaignId || !misId) {
      throw new apiError(
        400,
        "Campaign ID and MIS IDs are required and must be an array"
      );
    }

    const mis = await User.findById(misId);

    const campaignDoc = await campaign.findById(campaignId);

    if (!campaignDoc || !mis) {
      throw new apiError(404, "details not found");
    }

    mis.listOfCampaigns.push(campaignDoc._id);

    await mis.save();

    res
      .status(200)
      .json(
        new apiResponse(200, mis, "Campaign assigned to MIS users successfully")
      );
  } catch (error) {
    console.error("Error assigning campaign to MIS users:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while assigning the campaign"
    );
  }
});

//unassign the campaign from Mis
const unassignCampaignToMis = asyncHandler(async (req, res) => {
  try {
    const { campaignId, misId } = req.body;

    if (!campaignId || !misId) {
      throw new apiError(400, "Campaign ID and MIS ID are required");
    }

    const misDoc = await User.findById(misId);

    if (!misDoc) {
      throw new apiError(404, "Mis not found");
    }

    misDoc.listOfCampaigns.pop(campaignId);

    await misDoc.save();

    res
      .status(200)
      .json(
        new apiResponse(
          200,
          misDoc,
          "Campaign unassigned from MIS user successfully"
        )
      );
  } catch (error) {
    console.error("Error unassigning campaign from MIS user:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while unassigning the campaign"
    );
  }
});

// MANAGER 

// assign campaign to MIS
const assignClientToManager = asyncHandler(async (req, res) => {
  try {
    const { clientId, managerId } = req.body; // Allow multiple `misIds`

    if (!clientId || !managerId) {
      throw new apiError(
        400,
        "Client ID and Manager IDs are required and must be an array"
      );
    }

    const manager = await User.findById(managerId);

    const clientDoc = await client.findById(clientId);

    if (!clientDoc || !manager) {
      throw new apiError(404, "details not found");
    }

    manager.listOfClients.push(clientDoc._id);

    await manager.save();

    res
      .status(200)
      .json(
        new apiResponse(200, manager, "Client assigned to Manager users successfully")
      );
  } catch (error) {
    console.error("Error assigning campaign to manager users:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while assigning the client"
    );
  }
});

//unassign the campaign from Mis
const unassignClientToManager = asyncHandler(async (req, res) => {
  try {
    const { clientId, managerId } = req.body;

    if (!clientId || !managerId) {
      throw new apiError(400, "Client ID and Manager ID are required");
    }

    const managerDoc = await User.findById(managerId);

    if (!managerDoc) {
      throw new apiError(404, "manager not found");
    }

    managerDoc.listOfClients.pop(clientId);

    await managerDoc.save();

    res
      .status(200)
      .json(
        new apiResponse(
          200,
          managerDoc,
          "Client unassigned from manager user successfully"
        )
      );
  } catch (error) {
    console.error("Error unassigning client from manager:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while unassigning the client"
    );
  }
});



// fetch mis id's

const fetchUsersByRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.body;

    const users = await User.find({ role: role });

    if (!users || users.length === 0) {
      return res.status(200).json(new apiResponse(200, [], `No ${role} found`));
    }

    res
      .status(200)
      .json(
        new apiResponse(200, users, `Fetched all ${role} users successfully`)
      );
  } catch (error) {
    console.error(`Error fetching ${role}`, error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "An error occurred while fetching MIS users"
    );
  }
});

const updateUserRights = asyncHandler(async (req, res) => {
  try {
    const {
      formId,
      campaignId,
      clientId,
      employeeId,
      viewData,
      downloadData,
      manipulateData,
      downloadReport,
    } = req.body;

    if (!formId || !campaignId || !clientId || !employeeId) {
      return res
        .status(400)
        .json(
          new apiError(
            400,
            "Form ID, Campaign ID, Client ID, and Employee ID are required"
          )
        );
    }

    const updates = {};
    if (viewData !== undefined) updates.viewData = viewData;
    if (downloadData !== undefined) updates.downloadData = downloadData;
    if (manipulateData !== undefined) updates.manipulateData = manipulateData;
    if (downloadReport !== undefined) updates.downloadReport = downloadReport;

    const result = await campaignRights.updateOne(
      { formId, campaignId, clientId, employeeId },
      { $set: updates }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json(new apiError(404, "No matching document found to update"));
    }

    res
      .status(200)
      .json(new apiResponse(200, result, "User rights updated successfully"));
  } catch (error) {
    console.error("Error updating user rights:", error);
    res
      .status(500)
      .json(new apiError(500, "An error occurred while updating user rights"));
  }
});

const fetchUserRights = asyncHandler(async (req, res) => {
  try {
    const { formId, employeeId } = req.body;

    if (!formId || !employeeId) {
      return res
        .status(400)
        .json(new apiError(400, "Form ID and Employee ID are required"));
    }

    const userRights = await campaignRights.find({ formId, employeeId });

    if (!userRights) {
      return res
        .status(404)
        .json(new apiError(404, "No rights found for this user"));
    }

    res
      .status(200)
      .json(
        new apiResponse(200, userRights, "User rights fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching user rights:", error);
    res
      .status(500)
      .json(new apiError(500, "An error occurred while fetching user rights"));
  }
});

const fetchData = asyncHandler(async (req, res) => {
  try {
    const { collectionName } = req.body;

    if (!collectionName) {
      return res
        .status(400)
        .json(new apiError(400, "Collection name is required"));
    }

    const DynamicModel = mongoose.model(
      collectionName,
      new mongoose.Schema({}, { strict: false }),
      collectionName
    );
    const data = await DynamicModel.find();

    if (!data) {
      return res.status(404).json(new apiError(404, "No data found"));
    }

    res
      .status(200)
      .json(new apiResponse(200, data, "Data fetched successfully"));
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json(new apiError(500, "An error occurred while fetching data"));
  }
});

const fillFormData = asyncHandler(async (req, res) => {
  try {
    const reqData = req.body;
    const collectionName = req.params.collectionName;

    if (!reqData) {
      throw new apiError(400, "Missing required data fields.");
    }

    // Check if model already exists
    const DynamicModel =
      mongoose.models[collectionName] ||
      mongoose.model(
        collectionName,
        new mongoose.Schema({}, { strict: false })
      );

    const document = new DynamicModel(reqData);
    const savedData = await document.save();

    res
      .status(200)
      .json(new apiResponse(200, savedData, "Data saved successfully."));
  } catch (error) {
    console.error("Error in saving the data.", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "Error in saving the data"
    );
  }
});

const fetchNumberOfClientsAndCampaigns = asyncHandler(async (req, res) => {
  try {
    const numberOfClients = await client.countDocuments();
    const numberOfCampaigns = await campaign.countDocuments();
    const numberOfForms = await formsFieldsModel.countDocuments();
    const numberOfPromoters = await Promoter.countDocuments();

    const data = {
      numberOfClients: numberOfClients,
      numberOfCampaigns: numberOfCampaigns,
      numberOfForms: numberOfForms,
      numberOfPromoters: numberOfPromoters,
    };

    res
      .status(200)
      .json(new apiResponse(200, data, "Number of Documents fetched."));
  } catch (error) {
    console.error("Error in fetching the data.", error);
    throw new apiError(400, "Error in fetching the data");
  }
});

const fetchFormsForCampaigns = asyncHandler(async (req, res) => {
  try {
    const { campaignId } = req.body;

    if (!campaignId) {
      throw new apiError(400, "Missing required data fields.");
    }

    const forms = await FormFieldSchema.find({ campaignId: campaignId });

    res
      .status(200)
      .json(new apiResponse(200, forms, "Forms for campaigns Fetched."));
  } catch (error) {
    console.error("Error in fetching the data.", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "Error in fetching the data"
    );
  }
});

const acceptRejectData = asyncHandler(async (req, res) => {
  try {
    const { itemId, formId, acceptData } = req.body;

    if (!formId || acceptData === undefined || !itemId) {
      throw new apiError(400, "Invalid input");
    }

    const form = await FormFieldSchema.findById(formId);

    if (!form) {
      throw new apiError(404, "Form not found");
    }

    console.log("Form details:", form);

    const collectionName = form.collectionName;

    // Check if the collectionName is valid
    if (!collectionName) {
      throw new apiError(404, "Collection name not found");
    }

    // Check if the model already exists
    let DynamicModel = mongoose.models[collectionName];

    if (!DynamicModel) {
      // If the model does not exist, create it
      const schema = new mongoose.Schema({}, { strict: false });
      DynamicModel = mongoose.model(collectionName, schema, collectionName);
    }

    // Update the document in the dynamic collection
    const result = await DynamicModel.findByIdAndUpdate(
      itemId,
      { acceptedData: acceptData },
      { new: true, runValidators: true }
    );

    console.log("Update result:", result);

    if (!result) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res
      .status(200)
      .json({ message: "Data updated successfully", data: result });
  } catch (error) {
    console.error("Error in updating the data:", error);
    throw new apiError(
      error.statusCode || 500,
      error.message || "Internal Server Error"
    );
  }
});
//create a new controller to fetch nested forms
//parameters: mainformid=> look for an array object (nestedForms : Array (1)) fetch this
// create route in route.js for this
//adminFormdetails.jsx pe call this url(api call)
module.exports = {
  unassignCreatedForm,
  fetchFormsForCampaigns,
  fetchNumberOfClientsAndCampaigns,
  fillFormData,
  fetchData,
  fetchUserRights,
  updateUserRights,
  acceptRejectData,
  assignCreatedForm,
  createNestedForm,
  createNewForm,
  createNewCampaign,
  fetchCampaignDetails,
  fetchAllCampaigns,
  fetchAllClientSpecificCampaigns,
  deleteCampaign,
  deleteClient,
  fetchAllClients,
  fetchClient,
  createNewClient,
  fetchNestedForms,
  assignCampaignToMis,
  unassignCampaignToMis,
  assignClientToManager,
  unassignClientToManager,
  fetchUsersByRole,
};
``;
