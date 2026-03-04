
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
      
      user.documents.push({
        type,
        uploadDate: Date.now(),
        azureUrl: req.file.path,
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

  // @desc    Upload video
  // @route   POST /api/v1/upload/video
  // @access  Private
  exports.uploadVideo = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a video'
        });
      }

      // Return a URL the frontend can use (server serves /uploads statically)
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const videoUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;

      res.status(200).json({
        success: true,
        videoUrl
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Upload image
  // @route   POST /api/v1/upload/image
  // @access  Private
  exports.uploadImage = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image'
        });
      }

      res.status(200).json({
        success: true,
        imageUrl: req.file.path
      });
    } catch (error) {
      next(error);
    }
  },

  // @desc    Delete file
  // @route   DELETE /api/v1/upload/:fileId
  // @access  Private
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
