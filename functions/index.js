const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const path = require('path');
const os = require('os');
const fs = require('fs');
const thumb = require('image-thumbnail');
exports.notification = functions.firestore
  .document('/notification/{documentId}')
  .onCreate(snap => {
    let sended = true;
    let message_error = '';
    const message = {
      notification: snap.data().notification,
      tokens: snap.data().tokens,
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then(returns => {
        functions.logger.log('messages sended ' + returns.successCount);
        if (returns.failureCount > 0) {
          sended = false;
          for (let i = 0; i < returns.responses.length; i++) {
            const messageError = returns.responses[i].error?.message.toString();
            functions.logger.log('messages with error ' + messageError);
            message_error =
              message_error + '/ messages with error ' + messageError;
          }
        }
      });
    return snap.ref.update({sended, message_error}, {merge: true});
  });

exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(async object => {
    // [END generateThumbnailTrigger]
    // [START eventAttributes]
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.

    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (fileName.startsWith('thumb_')) {
      return functions.logger.log('Already a Thumbnail.');
    }
    // [START thumbnailGeneration]
    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType,
    };
    await bucket.file(filePath).download({destination: tempFilePath});
    functions.logger.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    const image = await thumb(tempFilePath, {
      width: 100,
      height: 100,
      responseType: 'base64',
      fit: 'outside',
    });
    const user = filePath.toString().split(/(\.jpeg)|(\.png)|(\.jpg)/)[0];
    const user_mail = user.split('/')[1];
    try {
      admin.firestore().collection('user').doc(user_mail).update({image});
    } catch (e) {
      functions.logger.log('Error with the user ', user, e.message);
    }
  });
