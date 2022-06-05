# Grad-Gallery-Project

Proof-of-concept website for highschool grads to upload their baby photos. 

Uploaded pictures are sent to "uploadedImages" folder through index.php and their information is stored in galleryinfo.json. Initially images are unapproved and cannot be viewed in the main gallery (gallery.html) - they must be approved through the moderator galllery (moderatorgallery.html) and if done so galleryinfo.json will be updated to indicate their approved status.

Index.php creates thumbnails of all uploaded images, stored in the "thumbs" folder and there is a galleryinfo.json entry that stores all info about every uploaded image (first name of uploader, last name, description of image, tags added, private / public, whether they have been approved, their filename, and their UID). Images may be sorted by date of upload, first name A-Z, or last name A-Z. Images may be deleted from the moderator gallery (which will then delete the corresponding image & JSON entry).



