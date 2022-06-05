

<?php 
	session_start();
	
	$firstNameErr = "";
	$lastNameErr = "";
	$fileErr = "";
	$privacyErr = "";
	$descriptionErr = "";
	$tagsErr = "";
	$agreementErr = "";
	
	$firstName = "";
	$lastName = "";
	$fileExtension = "";
	$privacy = "";
	$description = "";
	$tags = "";
	$agreement = "";
	$search = "";
	
	$showPrivacy = "publicprivate";
	
	$sort = "date";
	$file = "";
	
	$nextImageNum = 1;
	$nextImageString = "0001";

	if (empty($_POST["sort"])) {
	} else {
		$sort = test_input($_POST["sort"]);
	} # else if
	
	if (!empty($_POST["imageToApprove"])) {

		$myFile = test_input($_POST["imageToApprove"]);
		
		$file = "galleryinfo.json";
		$filearray = file($file);
		$jsonstring = "";

		$jsonstring = "";
		foreach ($filearray as $line) {
			$jsonstring .= $line;
		} # for each
		
		$phparray = json_decode($jsonstring, true);

		$myFile = substr($myFile, -8, -4);
		foreach ($phparray as $key => $line) {
			if ($line["UID"] == $myFile) {
				$phparray[$key]["approved"] = "yes";
			}//
		} # for each
		
		$jsoncode = json_encode($phparray, JSON_PRETTY_PRINT);

		// write the json to the file
		file_put_contents($file, $jsoncode);
		
	} # if
	
	if (!empty($_POST["postvar"])) {

		
		$myFile = test_input($_POST["postvar"]);
		$myFileLink = fopen($myFile, 'w') or die("can't open file");
		fclose($myFileLink);
		unlink($myFile) or die("Couldn't delete file");
		
		$myFile = str_replace( "uploadedImages", "thumbs", $myFile);
		$myFileLink = fopen($myFile, 'w') or die("can't open file");
		fclose($myFileLink);
		unlink($myFile) or die("Couldn't delete file");
		
		
		$file = "galleryinfo.json";
		$filearray = file($file);
		$jsonstring = "";

		$jsonstring = "";
		foreach ($filearray as $line) {
			$jsonstring .= $line;
		} # for each
		
		$phparray = json_decode($jsonstring, true);

		$myFile = substr($myFile, -8, -4);
		foreach ($phparray as $key => $line) {
			if ($line["UID"] == $myFile) {
				unset($phparray[$key]); 
				$phparray = array_values($phparray); 
			}//
		} # for each
		
		$jsoncode = json_encode($phparray, JSON_PRETTY_PRINT);

		// write the json to the file
		file_put_contents($file, $jsoncode);
		
	} # if
		
	if (empty($_POST["first"])) {
		$firstNameErr = "First name required";
	} else {
		$firstName = test_input($_POST["first"]);
		// check if name only contains letters and whitespace
		if (!preg_match("/^[a-zA-Z ]*$/",$firstName)) {
		  $firstNameErr = "Only letters allowed"; 
		} # if 
	} # else if

	if (empty($_POST["last"])) {
		$lastNameErr = "Last name required";
	} else {
		$lastName = test_input($_POST["last"]);
		// check if name only contains letters and whitespace
		if (!preg_match("/^[a-zA-Z ]*$/",$lastName)) {
		  $lastNameErr = "Only letters allowed"; 
		} # if
	} # if else

	if (empty($_POST["description"])) {
		$descriptionErr = "Description of image required";
	} else {
		$description= test_input($_POST["description"]);
	} # if else

	
	if (empty($_POST["tags"])) {
		$tagsErr = "Please tag the image";
	} else {
		$tags = test_input($_POST["tags"]);
	} # if else
		
	if (empty($_POST["showPrivacy"])) {
		$showPrivacy = "publicprivate";
	} else {
		$showPrivacy = test_input($_POST["showPrivacy"]);
	} # if else


	if (empty($_POST["privacy"])) {
		$privacyErr = "Please select a privacy option";
	} else {
		$privacy = test_input($_POST["privacy"]);
	} # if else
	  
  
	if (empty($_POST["agreement"])) {
		$agreementErr = "Please accept the copyright to continue";
	} else {
		 $agreement = "checked";
	} # if else
	
	if (isset($_POST["submit"])) {
	
		if (empty($_FILES["fileUpload"])) {
			$fileErr = "Please upload a file";
		} else {
			$target_dir = "uploadedImages/";
			$target_file = $target_dir . basename($_FILES["fileUpload"]["name"]);
			$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		
			if ($_FILES["fileUpload"]["size"] > 4000000) {
					//echo "Sorry, your file is too large.";
					$fileErr = "File is too large";
					//echo "asdfsa";
			} 
				
			// Allow certain file formats
			if($imageFileType != "jpg" && $imageFileType != "png") {
				//echo "Sorry, only JPG, PNG & GIF files are allowed.";
				$fileErr = "Please upload a jpg / png";
			} 
				
			
			if ($fileErr != "") {
				//echo "Please upload png / jpg less thna 4 MB";
			}
			
			//echo $fileErr;
		} # if else 
	} # if
	
	if(isset($_SESSION['counter'])) {
		//$_SESSION["nextImageNum"] ++;
		//echo $_SESSION["nextImageNum"];
		$_SESSION['counter'] += 1;
    } else {
		$firstNameErr = "";
		$lastNameErr = "";
		//$fileErr = "";
		$privacyErr = "";
		$descriptionErr = "";
		$tagsErr = "";
		$agreementErr = "";
		
		$firstName = "";
		$lastName = "";
		$file = "";
		$privacy = "";
		$description = "";
		$tags = "";
		$agreement = "";
		$_SESSION['counter'] = 1;
    } # if else
	
	function echoFile() {
		$file = "galleryinfo.json";
		$filearray = file($file);
	 
		// create one string from the file
		$jsonstring = "";
		foreach ($filearray as $line) {
			$jsonstring .= $line;
		} # for each
		echo "$page";
	}
		

	function test_input($data) {
	  $data = trim($data);
	  $data = stripslashes($data);
	  $data = htmlspecialchars($data);
	  return $data;
	} # test_input
	
	function getImgString($str) {
		$str = substr($str, -11);
		$str = substr($str, 0, 8);
		//echo "<img src='uploadedImages/$str'>";
		//echo "<br>";
	} # getImgString
	
	if (isset($_GET["page"])) {
		$page = $_GET["page"];
	} else {
		$page = "home";
	} # if else
	
	if (!empty($_POST["login"])) {
		$_SESSION["isEditor"] = true;
	} else if (!empty($_POST["logout"])) {
		$_SESSION["isEditor"] = false;
	} 
	
	if (!isset($_SESSION["isEditor"])) {
		$_SESSION["isEditor"] = false;
	} 

	$isEditor = $_SESSION["isEditor"];
	
	if (isset($_POST["search"])) {
		$search = $_POST["search"];
	} else {
		$search = "Akjldsaflkjbsafd890123840-";
	} # if else
	

	function createThumbnail($source_folder, $thumbs_folder, $source_file, $extension, $thumbHeight){
		//echo "$source_folder, $thumbs_folder, $source_file, $extension, $thumbHeight";
		if ($extension == 'gif') {
			$imgt = "ImageGIF";
			$imgcreatefrom = "ImageCreateFromGIF";
		}else if($extension == 'jpg' || $extension == 'jpeg'){
			$imgt = "imagejpeg";
			$imgcreatefrom = "imagecreatefromjpeg";
		}else if ($extension == 'png') {
			$imgt = "imagepng";
			$imgcreatefrom = "imagecreatefrompng";
		} // if else
		if ($imgt) {
			$img = $imgcreatefrom( $source_folder.$source_file.'.'.$extension );
			$width = imagesx( $img );
			$height = imagesy( $img );
			// keep aspect ratio with these operations...
			$new_width = floor( $width * ( $thumbHeight / $height ) );
			$new_height = $thumbHeight;
			$tmp_img = imagecreatetruecolor( $new_width, $new_height );
			if($extension == 'png'){
				// Disable alpha mixing and set alpha flag if is a png file
				imagealphablending($tmp_img, false);
				imagesavealpha($tmp_img, true);
			} // if
			imagecopyresized( $tmp_img, $img, 0, 0, 0, 0, $new_width, $new_height, $width, $height );
			$imgt( $tmp_img, $thumbs_folder.($source_file.".".$extension));
		} // if
	} // createThumbnail
	
	function createThumbs() {
	  $pathToImages = "uploadedImages/";
	  $pathToThumbs = "thumbs/";
	  $thumbWidth = 250;
	  $thumbHeight = 175;
	  // open the directory
	  $dir = opendir( $pathToImages );

	  // loop through it, looking for any/all JPG files:
	  while (false !== ($fname = readdir( $dir ))) {
		  
		  
			// parse path for the extension
			$info = pathinfo($pathToImages . $fname);
		  if (!strtolower($info['extension']) == "") {
			  
			  createThumbnail($pathToImages, $pathToThumbs, substr($fname, 0, 4), strtolower($info["extension"]), 175);
		  
			
		  } // if

		} // while
	  // close the directory
	  closedir( $dir );
	}
	
	if (!file_exists('galleryinfo.json')) {
		touch('galleryinfo.json');
		file_put_contents('galleryinfo.json', "[]"); 
	}
	
	if ($page == "resetGallery") {
		if (file_exists('galleryinfo.json')) {
			file_put_contents('galleryinfo.json', "[]");
		} else {
			touch('galleryinfo.json');
			$file = "galleryinfo.json";
			file_put_contents('galleryinfo.json', "[]"); 
		}
		if (file_exists("uploadedImages")) {
			system('rm -rf ' . escapeshellarg("uploadedImages"));
			mkdir("uploadedImages", 777);
		} # if 
	} else if ($page == "userUpload") {
		include 'form.html';
	} else if ($search != "Akjldsaflkjbsafd890123840-") {
		$page="gallery";
		if ($isEditor) {
			include "gallery.html";
		} else {
			include "moderatorgallery.html";
		} // if
		echo "<pre>";
		include "galleryinfo.json";
		//session_destroy();
	} else if ($page == "gallery") {
		//session_destroy();
		
		if (isset($_GET["submit"])) {
			$page = $_GET["page"];
		} else {
			$page = "home";
		} # if else
		
		// read json file into array of strings
		$file = "galleryinfo.json";
		$filearray = file($file);
	 
		// create one string from the file
		$jsonstring = "";
		$imgList = "";
		foreach ($filearray as $line) {
			$jsonstring .= $line;
			if (strpos($line,'imageFile')) {
				getImgString($line);
			} # if
		} # for each
		
		if ($isEditor) {
			include "gallery.html";
		} else {
			include "moderatorgallery.html";
		} // if
		echo "<pre>";
		
		$test = substr($jsonstring, -13);
		$test = substr($test, 0, 4);
		$integerRep = (int)$test;
		echo $jsonstring;
		echo "</pre>";	
	} else if (isset($_POST["submit"]) && $_SESSION['counter'] != 1 && $fileErr == "" && $firstNameErr == "" && $lastNameErr == "" && $descriptionErr == "" && $tagsErr == "" && $privacyErr == "" && $agreementErr== "") {
		$_SESSION['counter'] = 1;
		
		// read json file into array of strings
		$file = "galleryinfo.json";
		$filearray = file($file);
	 
		// create one string from the file
		$jsonstring = "";
		foreach ($filearray as $line) {
			$jsonstring .= $line;
		} # for each
	
		
		$test = substr($jsonstring, -13);
		$test = substr($test, 0, 4);
		
		$integerNum = (int)$test;
		$integerNum ++;
		$test = (String)$integerNum;
		$integerNum = strlen($test);
		
		if ($integerNum == 1) {
			$test = "000" . $test;
		} else if ($integerNum == 2) {
			$test = "00" . $test;
		} else if ($integerNum == 3) {
			$test = "0" . $test;
		}
		
		
		
		
		//decode the string from json to PHP array
		$phparray = json_decode($jsonstring, true);

		// add form submission to data and remove submit button
		unset($_POST["submit"]);
		unset($_POST["agreement"]);
		$_POST["privacy"] = $privacy;
		$_POST["approved"] = "no";
		$_POST["imageFile"] = $test . "." . $imageFileType;
		$_POST["UID"] = $test;
		$phparray [] = $_POST;
		

		if (move_uploaded_file($_FILES["fileUpload"]["tmp_name"], $target_file)) {
			rename($target_file, "uploadedImages/" . $test . "." . $imageFileType);
		} else {
		}
			
		
		//$phparray [] .= $fileExtension;

		// encode the php array to formatted json 
		$jsoncode = json_encode($phparray, JSON_PRETTY_PRINT);
		
		createThumbs();
	
		
	 
		// write the json to the file
		file_put_contents($file, $jsoncode);
		
		
		$firstNameErr = "";
		$lastNameErr = "";
		$fileErr = "";
		$privacyErr = "";
		$descriptionErr = "";
		$tagsErr = "";
		$agreementErr = "";
		
		$firstName = "";
		$lastName = "";
		$file = "";
		$privacy = "";
		$description = "";
		$tags = "";
		$agreement = "";
		
		
		
		if ($isEditor) {
			include "gallery.html";
		} else {
			include "moderatorgallery.html";
		} // if
		
		
	} else {
		if ($isEditor) {
			include "gallery.html";
		} else {
			include "moderatorgallery.html";
		} // if

	} # if else

?>