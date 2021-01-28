/// APPLICATION CONFIGURATION
var appConfig={
	 'used_fields' : 2, // number of active fields in json_form.html
	 'all_fields' : 24 // total number of fields in json_form.html
}

/// APPLICATION CONFIGURATION - End

/// HANDLERS
// Handle event of data upload data
function handleFileLoad(event){
	  var Kenc = $("#passphrase1").val()
	  var KeyG = Kenc;
      
	  var file_id = $("#fileid1").val()
	  var keyid = $("#keyid1").val()
	  
	  if(file_id==""){
		  file_id=hash(Math.random().toString(36).substring(7)); // generate unique file_id. This should be changed in production
	  }
	  console.log("file id:",file_id);
	  var jsonObj = JSON.parse(event.target.result); //parse json file content into json objects
      
      var st_date = new Date();
      var st_time = st_date.getTime();
      
	  var ret = uploadData(jsonObj,file_id,KeyG,Kenc,keyid); // Upload data to CSP
	  
      var end_date = new Date();
      var end_time = end_date.getTime();
      var diff = end_time - st_time;
      
	  if(ret==false){
		  message = "Existed file id. Please enter a unique file id"
	  }
	  else{
		  message = "Submit process completed."
	  }
	
      console.log(message);
      $('#notify').html("<div class='alert-primary alert'>" + message + "</div>");
      $('#exetime').html("<div class='alert-primary alert'> Exec time:" +  diff + " </div>");
}

// Handle search data event
function handleSearchFileLoad(event){
	var Kenc = $("#passphrase2").val();
	var KeyG = Kenc;
	var keyid = $("#keyid2").val()
	
	var jsonObj = JSON.parse(event.target.result);
	
	var st_date = new Date();
    var st_time = st_date.getTime();
   
	var results=search(jsonObj,KeyG,Kenc,keyid);
	
	if(results==null){
		message = "Invalid input file"
	}
	else
		message = results["count"]
	
    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
    
	console.log("Found results:",results);
	
	$('#result').empty();
	$('#searchtime').empty();
	$('#result').append("<div class='alert-primary alert'> Found " + message + " results </div>");
	$('#searchtime').html("<div class='alert-primary alert'> Search time: " +  diff + " </div>");
}

// Include sse.js
function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); //Make a script DOM node
    script.src = url; //Set it's src to the provided URL
    document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

//Handle update data event
function handleUpdateFileLoad(event){
	var Kenc = $("#passphrase3").val();
	var KeyG = Kenc;
	
	var keyid =$("#keyid3").val();
	
	var jsonObj = JSON.parse(event.target.result);
	
	var st_date = new Date();
    var st_time = st_date.getTime();
    var file_id = $("#fileid2").val() 
    if(file_id==""||keyid==""){
    	message = "Please provide file id and/ or key id"
	}
    else{
    	var result=updateData(jsonObj,file_id,KeyG,Kenc,keyid);
    	console.log("Update result:",result)
    	if(result==true){
    		message = "Updated"
    	}
    	else
    		message = "At least one update field/ value does not exist. Halt update."
    }
    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
	
	$('#update').empty();
	$('#updatetime').empty();
	$('#update').append("<div class='alert-primary alert'>" + message+ "</div>");
	$('#updatetime').html("<div class='alert-primary alert'> Update time: " +  diff + " </div>");
	
}

//Handle update data event
function handleDeleteFile(){
	var Kenc = $("#passphrase4").val();
	var KeyG = Kenc;
	
	var st_date = new Date();
    var st_time = st_date.getTime();
    var file_id = $("#fileid3").val() 
    var keyid = $("#keyid4").val() 
    if(file_id=="" || keyid==""){
    	message = "Please provide file id and key id"
 	}
    else{
    	console.log("Delete data")
    	var result=deleteData(file_id,KeyG,Kenc,keyid);
    	console.log("Delete result:",result)
    	if(result==true){
    		message = "Deleted"
    	}
    	else
    		message = "There is some error."
    }
    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
	
	$('#delete').empty();
	$('#deletetime').empty();
	$('#delete').append("<div class='alert-primary alert'>" + message+ "</div>");
	$('#deletetime').html("<div class='alert-primary alert'> Delete time: " +  diff + " </div>");
}

function handleBlobDecrypt(fname,keyId){
	var Kenc = $("#passphrase6").val();
	
	var st_date = new Date();
    var st_time = st_date.getTime();
    downloadDecryptBlob(fname,Kenc,keyId);
    
    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
}

function handleProgressBlobDecrypt(fname,keyId){
	var Kenc = $("#passphrase6").val();
	
	var st_date = new Date();
    var st_time = st_date.getTime();
    downloadProgressDecryptBlob(fname,Kenc,keyId);
    
    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
}

// Browse file, encrypt it and upload to Minio
function handleBlobUpload(event){
	var Kenc = $("#passphrase5").val();
	
	var st_date = new Date();
    var st_time = st_date.getTime();

    var fname = $("#filename").val();
    var ftype = $("#filetype").val();
    var outputname = fname.split(".")[0];// + "_encrypted";
    console.log("Filename: " + typeof  fname);
    console.log("Type: " +  ftype);

    var blobData = new Blob([new Uint8Array(event.target.result)], {type: ftype });
    
    var keyId = $("#keyid5").val();
    encryptUploadBlob(blobData,fname,Kenc,keyId);

    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
}


function handleBlobProgressUpload(event){
	var Kenc = $("#passphrase5").val();
	var keyId = $("#keyid5").val();
	
	var st_date = new Date();
    var st_time = st_date.getTime();

    var fname = $("#filename").val();
    var ftype = $("#filetype").val();
   
    var outputname = fname.split(".")[0];// + "_encrypted";
    console.log("Filename: " + typeof  fname);
    console.log("Type: " +  ftype);
    

    var blobData = new Blob([new Uint8Array(event.target.result)], {type: ftype });
    
    encryptProgressUploadBlob(blobData,fname,Kenc,keyId);

    var end_date = new Date();
    var end_time = end_date.getTime();
    var diff = end_time - st_time;
}

function handleBlobSSEUpload(jsonObj){
	return function(event){
		var Kenc = $("#passphrase7").val();
		var KeyG = Kenc;
		
		var keyId = $("#keyid7").val();
		
		var st_date = new Date();
	    var st_time = st_date.getTime();
	
	    var fname = $("#filename").val();
	    var ftype = $("#filetype").val();
	    var outputname = fname.split(".")[0];// + "_encrypted";
	    console.log("Filename: " + typeof  fname);
	    console.log("Type: " +  ftype);
	
	    var blobData = new Blob([new Uint8Array(event.target.result)], {type: ftype });
	    
	    encryptUploadSearchableBlob(blobData,fname,jsonObj,fname,KeyG,Kenc,keyId);
	
	    var end_date = new Date();
	    var end_time = end_date.getTime();
	    var diff = end_time - st_time;
	}
}

function handleProgressBlobSSEUpload(jsonObj){
	return function(event){
		var Kenc = $("#passphrase7").val();
		var KeyG = Kenc;
		var keyId = $("#keyid7").val();
		
		var st_date = new Date();
	    var st_time = st_date.getTime();
	
	    var fname = $("#filename").val();
	    var ftype = $("#filetype").val();
	    var outputname = fname.split(".")[0];// + "_encrypted";
	    console.log("Filename: " + typeof  fname);
	    console.log("Type: " +  ftype);
	
	    var blobData = new Blob([new Uint8Array(event.target.result)], {type: ftype });
	    
	    encryptProgressUploadSearchableBlob(blobData,fname,jsonObj,fname,KeyG,Kenc,keyId);
	
	    var end_date = new Date();
	    var end_time = end_date.getTime();
	    var diff = end_time - st_time;
	}
}


/// HANDLERS - END

$(document).ready(
		function() {
			$("input[name='inputFormat']").change(function () {
	            if ($(this).val() == 'json_input') {
					$("#json-form").prop("hidden", true);
					$("#search-form").prop("hidden", true);
					
					$("#json-file").prop("hidden",false);
					$("#search-file").prop("hidden", false);
					
	            }
	            else {
					$("#json-file").prop("hidden",true);
					$("#search-file").prop("hidden", true);
					
					$("#json-form").prop("hidden", false);
					$("#search-form").prop("hidden", false);
	            }
	        });
			
			$("#jsonInput").click(function(){
				$('#notify').empty();
				$('#exetime').empty();
				$('#result').empty();
				$('#searchtime').empty();
			});
			
			$("#formInput").click(function(){
				$('#notify').empty();
				$('#exetime').empty();
				$('#result').empty();
				$('#searchtime').empty();
			});
			
			dynamicallyLoadScript('static/js/sse.js')
			
			// ADD PATIENT by submitting file
			$("#btnSendHashKey").click(function(){
				console.log("Send hashed key to TA")
				$('#uploadkeyg').empty();
				var key = $("#passphrase").val();
				var keyid = $("#keyid").val();
				uploadKeyG(key,keyid); // Upload data to CSP
				$('#passphrase').val("");
				$('#uploadkeyg').html("<div class='alert-primary alert'> Submitted </div>");
			});
			
			// ADD PATIENT by submitting file
			$("#btnSubmitFile").click(function(){
				$('#notify').empty();
				if ($('#jsonFile').get(0).files.length === 0) {
				    console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					reader.onload = handleFileLoad;
					reader.readAsText($('#jsonFile').get(0).files[0]);
				}
				$('#notify').html("<div class='alert-primary alert'> Submitted </div>");
			});
			
			console.log("Symmetric Searchable Encryption Scheme");
			
			
			// Submit with form
			noFields = appConfig.used_fields + 1; //1 is for the field 'csrf_token'
			allFields = appConfig.all_fields; 
			console.log("Number of visible fields: ", noFields );
			
			// Disable unused fields
			for(var i=noFields; i<= allFields; i++){
				var id = "#field" + i;
				$(id).prop( "disabled", true );
				
				id = "#select" + i;
				$(id).prop( "disabled", true );
			}
			
			/// ADD PATIENT by form
			$('#btnSubmit').click(function(){
				$('#notify').empty();
				$('#notify').html("<div class='alert-primary alert'> Submitting </div>");
				
				var data = $("#json-form").find("input[name!=csrfmiddlewaretoken]").serializeArray();//get all data, except the hidden value: "name":"csrfmiddlewaretoken"
				
				var KeyG = appConfig.KeyG;
				var Kenc = appConfig.key_encrypt; //Key for encrypting json object

				console.log("Number of input fields: ", data.length);
				console.log("Serialized data:",data[0]);
				
				var no_data = data.length;
				var jsonObj = '{';
				for(var i=0; i< no_data; i++){
					jsonObj = jsonObj + '"' + data[i]["name"] + '":"' + data[i]["value"] + '",' 
				}
				jsonObj = jsonObj.slice(0, -1); // remove the last comma
				jsonObj = jsonObj + '}';
				jsonObj = JSON.parse(jsonObj);
				console.log("Json data:",jsonObj);
			    
				var file_id = hash(Math.random().toString(36).substring(7));
				
				var st_date = new Date();
			    var st_time = st_date.getTime();
				uploadData(jsonObj,file_id,KeyG,Kenc); // Upload data to CSP
				  
			    var end_date = new Date();
			    var end_time = end_date.getTime();
			    var diff = end_time - st_time;
	
			    console.log("Submit process completed. Exec time: ", diff);
				$('#notify').empty();
				$('#notify').html("<div class='alert-primary alert'> Submitted </div>");
			    $('#exetime').html("<div class='alert-primary alert'> Exec time: " +  diff + " </div>");

			});//end btnSubmit
			
			/// SEARCH FOR PATIENT by form
			$('#btnSearch').click(function(){
				$('#result').empty();
				$('#result').html("<div class='alert-primary alert'> Searching </div>");
				
				// Get value of keyword from the search box and the radio box
				var selectVal = $("#searchBy  option:selected").val();
				var keyword = selectVal + "|" +  $("#keyword").val();
				
				var KeyG = appConfig.KeyG;	
				var Kenc = appConfig.key_encrypt;
				
				console.log("keyword for search", keyword);
				
				var st_date = new Date();
			    var st_time = st_date.getTime();
				data = findKeyword(keyword,KeyG,Kenc);	
				
			    var end_date = new Date();
			    var end_time = end_date.getTime();
			    var diff = end_time - st_time;
	
			    console.log("Search process completed. Exec time: ", diff);
			    console.log("Retrieved data:",data);
				$('#result').empty();
				$('#result').append("<div class='alert-primary alert'> Found " + data["count"] + " results </div>");

			    $('#searchtime').html("<div class='alert-primary alert'> Search time: " +  diff + " </div>");
			});//end btnSearch
			
			/// SEARCH FOR PATIENT by submitting json file
			$('#btnSearchFile').click(function(){
				$('#result').empty();
				$('#result').html("<div class='alert-primary alert'> Searching </div>");
				
				if ($('#jsonSearchFile').get(0).files.length === 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					reader.onload = handleSearchFileLoad;
					reader.readAsText($('#jsonSearchFile').get(0).files[0]);
				}
				
			});//end btnSearchFile
			
			/// UPDATE by submitting json file
			$('#btnUpdateFile').click(function(){
				$('#resultUpdate').empty();
				$('#resultUpdate').html("<div class='alert-primary alert'> Updating </div>");
				
				if ($('#jsonUpdateFile').get(0).files.length === 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					reader.onload = handleUpdateFileLoad;
					reader.readAsText($('#jsonUpdateFile').get(0).files[0]);
				}
			});
			
			/// DELETE by submitting json file
			$('#btnDeleteFile').click(function(){
				$('#resultDelete').empty();
				$('#resultDelete').html("<div class='alert-primary alert'> Deleting </div>");
				
				handleDeleteFile();
			});
			
			/// ENCRYPT BLOB by submitting blob file
			$('#btnUploadBlob').click(function(){
				$('#resultUploadBlob').empty();
				$('#resultUploadBlob').html("<div class='alert-primary alert'> Uploading </div>");
				
				if ($('#blobUpload').get(0).files.length === 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					reader.onload = handleBlobUpload;
					var file = $('#blobUpload').get(0).files[0];
					var filename = file.name;
					var filetype = file.type;
					 $("#filename").val(filename);
					 $("#filetype").val(filetype);
					console.log("name:",filename,",type:",filetype);
					reader.readAsArrayBuffer(file);
				}
			});
			
			$('#btnProgressUploadBlob').click(function(){
				$('#resultUploadBlob').empty();
				$('#resultUploadBlob').html("<div class='alert-primary alert'> Progressive Encrypting </div>");
				if ($('#blobUpload').get(0).files.length === 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					reader.onload = handleBlobProgressUpload;
					var file = $('#blobUpload').get(0).files[0];
					var filename = file.name;
					var filetype = file.type;
					 $("#filename").val(filename);
					 $("#filetype").val(filetype);
					console.log("name:",filename,",type:",filetype);
					reader.readAsArrayBuffer(file);
				}
			});

			$('#btnDownload').click(function(){
				console.log("Downloading")
				fname = $("#filename1").val()
				keyId = $("#keyid6").val()
				handleBlobDecrypt(fname,keyId);
			});	
			
			$('#btnProgressDownloadBlob').click(function(){
				console.log("Progressive Downloading")
				fname = $("#filename1").val()
				keyId = $("#keyid6").val()
				handleProgressBlobDecrypt(fname,keyId);
			});	
			
			/// ENCRYPT BLOB with METADATA by submitting blob file and metadata file
			$('#btnUploadBlobSSE').click(function(){
				$('#uploadblobsse').empty();
				$('#uploadblobsse').html("<div class='alert-primary alert'> Uploading </div>");
				
				if ($('#blobSSEUpload').get(0).files.length == 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					var jsonObj = {"size":"unknown"}
					reader.onload = handleBlobSSEUpload(jsonObj);
					var file = $('#blobSSEUpload').get(0).files[0];
					var filename = file.name;
					var filetype = file.type;
					 $("#filename").val(filename);
					 $("#filetype").val(filetype);
					console.log("name:",filename,",type:",filetype);
					reader.readAsArrayBuffer(file);
				}
			});
			
			$('#btnProgressUploadBlobSSE').click(function(){
				$('#uploadblobsse').empty();
				$('#uploadblobsse').html("<div class='alert-primary alert'> Uploading </div>");
				
				if ($('#blobSSEUpload').get(0).files.length == 0) {
					console.log("No files selected.");
				}
				else{
					var reader = new FileReader()
					var jsonObj = {"size":"unknown"}
					reader.onload = handleProgressBlobSSEUpload(jsonObj);
					var file = $('#blobSSEUpload').get(0).files[0];
					var filename = file.name;
					var filetype = file.type;
					 $("#filename").val(filename);
					 $("#filetype").val(filetype);
					console.log("name:",filename,",type:",filetype);
					reader.readAsArrayBuffer(file);
				}
			});
			
			$("#btnSendHashKeySGX").click(function(){
				console.log("Send hashed key to TA SGX")
				$('#uploadkeygsgx').empty();
				var key = $("#passphrase8").val();
				var keyid = $("#keyid8").val();
				uploadKeyGsgx(key,keyid); // Upload data to CSP
				$('#passphrase8').val("");
				$('#uploadkeyg8').html("<div class='alert-primary alert'> Submitted </div>");
			});
		});