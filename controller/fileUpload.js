const { FileUpload } = require("../model/FileUpload");

const saveFileDetails = async (filedetails, done) => {
  try {
    const { originalname, mimetype, size } = filedetails;

    const fileDetail = new FileUpload({
      name: originalname,
      type: mimetype, //image or video
      size: size,
    });

    const savedData = await fileDetail.save();

    const response = { name: savedData?.name, type: savedData?.type, size: savedData?.size };

    done(null, response);
  } catch (error) {
    done(error, nul);
  }
};

module.exports = { saveFileDetails };
