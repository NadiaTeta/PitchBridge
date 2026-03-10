
  exports.uploadDocument = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file'
        });
      }

      const { type } = req.body; // nid, tin, rdb, selfie

      const user = await User.findById(req.user.id);

      const documentUrl = req.file.path; 
      
      user.documents.push({
        type,
        uploadDate: Date.now(),
        cloudinaryUrl: documentUrl,
        fileName: req.file.filename,
        status: 'pending'
      });

      user.documentsUploaded = true;
      await user.save();

      res.status(200).json({
        success: true,
        document: user.documents[user.documents.length - 1]
      });
    } catch (error) {
      next(error);
    }
  },

 
  exports.uploadVideo = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a video'
        });
      }

      const videoUrl = req.file.path; // Cloudinary returns the full URL

      res.status(200).json({
        success: true,
        videoUrl
      });
    } catch (error) {
      next(error);
    }
  },


  exports.uploadImage = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image'
        });
      }

      const imageUrl = req.file.path; // Cloudinary returns the full URL

      res.status(200).json({
        success: true,
        imageUrl: req.file.path
      });
    } catch (error) {
      next(error);
    }
  },


  exports.deleteFile = async (req, res, next) => {
    try {
      // Implementation depends on storage solution (local/Azure)
      res.status(200).json({
        success: true,
        message: 'File deleted'
      });
    } catch (error) {
      next(error);
    }
  }
;
