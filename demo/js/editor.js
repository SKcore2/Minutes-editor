(function($) {

	Editor = function() {
		this.$element_;
		inst = inst || {};
		this.events_ = [];
		this.enterDocument();

	};

	Editor.EventType = {
		EDITOR : 'editor'
	};

	Editor.prototype.getElement = function() {
		return this.$element_;
	};

	Editor.prototype.enterDocument = function() {
		sessionStorage.clear();
		this.$element_ = $(".contents-root");
		this.bindEvents_();
	}

	Editor.prototype.exitDocument = function() {
		if (!this.$element_) {
			return;
		}
		if (this.events_.length > 0) {
			$.each(this.events_, function(idx, args) {
				this.$element_.off.apply(this.$element_, args);
			}.bind(this));
			this.events_ = [];
		}
		this.unbindEvents_();
		this.$element_ = null;
	}

	Editor.prototype.bindEvents_ = function() {
		this.$element_.on('click', '.text-strage-btn', this.saveModal_.bind(this));
		this.$element_.on('keydown', this.keydownFunction_.bind(this));
		this.$element_.on('click', '.reading-btn',this.readingText_.bind(this));
		this.$element_.on('click', '.dummy-file-btn',this.clickFilebtn_.bind(this));
		this.$element_.on('click', '.save-file-btn',this.clickSaveBtn_.bind(this));
		this.$element_.on('beforeunload',this.beforUnloadEvent_.bind(this));
		this.$element_.on('click','.upload-minutes',this.uploadEvent_.bind(this));
	}

	Editor.prototype.keydownFunction_ = function(e) {
		var target = e.target;
		if (e.ctrlKey === true && e.keyCode === 83) {
			event.preventDefault();
			var textData = this.inputTextData_(textData);

		} else if (e.ctrlKey === true) {

		} else {
			$(window).on('beforeunload', function(e) {
				return 'jquery beforeunload';
			});
		}
	}

	Editor.prototype.inputTextData_ = function(textData) {
		var title = $(".minutes-editor-title").val()
		var text = $("#minutes-textarea").val()
		text = text.split("<").join("&lt;");
		text = text.split(">").join("&gt;");
		text = text.split("\n").join("\r\n");
		textData = {
			text : text,
			title : title
		}
		var confirmed = false
		this.checkData(textData);
	}

	Editor.prototype.checkData = function(textData, confirmed) {
		var status = null;
		if (confirmed === true) {
			this.saveTextData_(textData);
		} else {

			if (textData.title === "" && textData.text === "") {
				status = "both";
				this.showConfirmDialog_(textData, status);
				event.stopPropagation();
			}
			else if(textData.title === ""){
				status = "title";
				this.showConfirmDialog_(textData, status);
				event.stopPropagation();
			}
			else if(textData.text === ""){
				status = "text"
				this.showConfirmDialog_(textData, status);
				event.stopPropagation();
			}
			else {
				this.saveTextData_(textData);
			}
		}
	}

	Editor.prototype.saveTextData_ = function(textData) {
		if (textData === undefined) {
			textData = {
				text : "",
				title : "無題"
			}

		}
		else if (textData.title === "") {
			textData = {
				text : textData.text,
				title : "無題"
			}

		}

		var blob = new Blob([ textData.text ], {
			type : "text/plain"
		});
		var a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.target = '_blank';
		a.download = textData.title;
		a.click();
		event.stopPropagation();
	}

	Editor.prototype.showConfirmDialog_ = function(textData, status) {
		$('#staticModal').modal('show');
		if(status === "both"){
			$(".confirm-text").text("何も入力されていませんがよろしいでしょうか？")
		}
		else if(status === "title"){
			$(".confirm-text").text("タイトルが入力されていませんが保存してもいいでしょうか？")

		}
		else if(status === "text"){

			$(".confirm-text").text("本文が入力されていませんが保存してもいいでしょうか？")
		}

		var strage = document.getElementById("text-strage-btn");
		$("#text-strage-btn").unbind('click')
		$("#text-strage-btn").bind('click',function(){
			Editor.prototype.saveModal_(textData);
		})
	}
	Editor.prototype.saveModal_ = function(textData) {
		$('#staticModal').modal('hide');
		window.alert("保存しました");
		this.saveTextData_(textData);
		 $(window).off('beforeunload');
	}

	Editor.prototype.validateText_ = function(data) {
		var partList =  	{
			varb:'動詞',
			symbol:'記号',
			noun:'名詞',
			filler: 'フィラー'
		};

		var detailList = {
			alphabet:'アルファベット',
			punctuation:'句点',
			properNoun:'固有名詞',
			name :'人名',
			general : '一般'
		}

		var lastPart = null;
		var lastDetail = null;
		var lastDetailTwo = null;
		var lastType = null;
		var lastValidate = null;
		var lastLineNum = null;
		var count = 0
		var lineNum = 1;
		var i = 0
		var alertList = $(".alert-list");

		this.initializeAlertarea_();

		while (i <data.length) {

			var part = data[i].pos;
			var word = data[i].surface_form;
			var detail = data[i].pos_detail_1;
			var detailTwo = data[i].pos_detail_2;
			var type = data[i].word_type;
			var position = data[i].ward_position;


			if (type === 'UNKNOWN') {
				if (part === partList["symbol"]) {
					if(word.match(/\r\n|\n/g)){
						var num = word.match(/\r\n|\n/g).length;
						lineNum = lineNum + num ;
					}
				}
				else if(word.match("-")){

				}
				else if (part === partList["noun"]) {
					if(detail === detailList["general"]){
//					alertList.append('<li class  ="validate-label"><span class = "label label-info">辞書にない単語が含まれています。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
//					$(".minutes-lines").eq(lineNum-1).addClass("yellow");
					}
				}
				else if(!isNaN(word)){

				}
				else {
					//if(lastType !== 'UNKNOWN'){
					//$(".alert-list").append('<li class ="validate-label"><span class = "label label-danger">辞書に登録されていない文字です。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
					//$(".minutes-lines").eq(lineNum-1).addClass("yellow");
					//}
				}

			} else if (type == 'KNOWN') {
				if (part === partList["symbol"]) {

					if (detail === detailList["alphabet"]) {
						alertList.append('<li class  ="validate-label"><span class = "label label-danger">アルファベットが含まれています。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
						$(".minutes-lines").eq(lineNum-1).addClass("yellow");
					} else if (detail === detailList["punctuation"]) {
						if (lastDetail === detailList["punctuation"] || lastDetailTwo === detailList[name]) {
							alertList.append('<li class  ="validate-label"><span class = "label label-warning">句点の位置がおかしい可能性があります。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
						$(".minutes-lines").eq(lineNum-1).addClass("yellow");
						}
					}
				} else if (part === partList["verb"]) {
					if (lastPart === partList["verb"]) {
//						$(".alert-list").append('<li class  ="validate-label"><span class = "label label-warning">動詞が続いています。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
//					} else if (detail === '非自立') {
//						if (lastPart === '名詞') {
//							$(".alert-list").append(
//									'<li class  ="validate-label"><span class = "label label-warning">名詞の後に非自立品詞が入っています。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
//						}
					}
					else if(lastDetailTwo === detailList["punctuation"]){
						alertList.append(
							'<li class  ="validate-label"><span class = "label label-warning">動詞の位置がおかしい可能性があります。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
							$(".minutes-lines").eq(lineNum-1).addClass("yellow");
					}

				} else if (part === partList["noun"]) {
					if(detail === detailList["properNoun"]){
						if(detailTwo === detailList["name"]){
							//$(".alert-list").append(
								//	'<li class  ="validate-label"><span class = "label label-info">人名が含まれています。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
						}
					}
//					else if(detail === '接尾'){
//						$(".alert-list").append(
//								'<li class  ="validate-label"><span class = "label label-warning">動詞の位置がおかしい可能性があります。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
//								$(".minutes-lines").eq(lineNum-1).addClass("yellow");
//					}
				}
				 else if (part === partList["filler"]) {
					 alertList.append('<li class  ="validate-label"><span class = "label label-warning">誤字が含まれている可能性があります。</span><span class = "line-number label label-default">' + lineNum  +  "行目" +  '</span></li>')
						$(".minutes-lines").eq(lineNum-1).addClass("yellow");
					}


			}
			lastType = type;
			lastPart = part;
			lastDetail = detail;
			lastDetailTwo = detailTwo;
			lastLineNum = lineNum;
			i=(i+1)|0


		}
	}

	Editor.prototype.getStorageItem_ = function(count){
		var allData = JSON.parse(sessionStorage.getItem(count + "allData"))
		if(allData == null){
			if(count== 0){
				return 1;
			}
			else{

			return ;
			}
		}
		count++;
		this.getStorageItem_(count);
	}

	Editor.prototype.initializeAlertarea_ = function() {
		$(".alert-list").children("li").remove();
		$("#minutes-textarea").parents(".editor-field").find(".lineno").addClass("minutes-lines")

		$(".minutes-lines").removeClass("yellow");
	}

	Editor.prototype.readingText_ = function(){

		var filebtn = document.getElementById("selfile");
		var newFilebtn = document.getElementById("new-selfile");

		//ダイアログでファイルが選択された時
		filebtn.addEventListener("change",function(evt){

		  var file = evt.target.files;

		  //FileReaderの作成
		  var reader = new FileReader();

		    reader.readAsArrayBuffer(file[0]);

		  //読込終了後の処理
		  reader.onload = function(ev){
			    var array = new Uint8Array(reader.result);

			    // 文字コードを取得
			    switch (Encoding.detect(array)) {
			    case 'UTF16':
			        // 16ビット符号なし整数値配列と見なす
			        array = new Uint16Array(e.target.result);
			        break;
			    case 'UTF32':
			        // 32ビット符号なし整数値配列と見なす
			        array = new Uint32Array(e.target.result);
			        break;
			    }

			    // Unicodeの数値配列に変換
			    var unicodeArray = Encoding.convert(array, 'UNICODE');
			    // Unicodeの数値配列を文字列に変換
			    var text = Encoding.codeToString(unicodeArray);

		    //テキストエリアに表示する
			$(".origin-editor-title").val(file[0].name);
		    document.test.txt.value = text;
		  }
		},false);

		newFilebtn.addEventListener("change",function(evt){

			  var file = evt.target.files;

			  //FileReaderの作成
			  var reader = new FileReader();
			  //テキスト形式で読み込む
			   reader.readAsArrayBuffer(file[0]);

			  //読込終了後の処理
			  reader.onload = function(ev){
				  var array = new Uint8Array(reader.result);

				    // 文字コードを取得
				    switch (Encoding.detect(array)) {
				    case 'UTF16':
				        // 16ビット符号なし整数値配列と見なす
				        array = new Uint16Array(e.target.result);
				        break;
				    case 'UTF32':
				        // 32ビット符号なし整数値配列と見なす
				        array = new Uint32Array(e.target.result);
				        break;
				    }

				    // Unicodeの数値配列に変換
				    var unicodeArray = Encoding.convert(array, 'UNICODE');
				    // Unicodeの数値配列を文字列に変換
				    var text = Encoding.codeToString(unicodeArray);
			    //テキストエリアに表示する
				$(".minutes-editor-title").val(file[0].name);
			    $("#minutes-textarea").val(text);
			  }
			},false);
	}

	Editor.prototype.clickFilebtn_ = function(e) {
		var target = e.target;
		if($(target).hasClass("new-dummy")){
			$("#new-selfile").click();
		}
		else{
		$("#selfile").click();
		}
	}
	Editor.prototype.clickSaveBtn_ = function(e) {
		var target = e.target;
		if($(target).hasClass("format-seve-btn")){
		Sidemenu.prototype.saveFormat();
		}
		else{
		var textData = this.inputTextData_(textData);
		}
	}
	Editor.prototype.beforUnloadEvent_ = function(){

	}

	Editor.prototype.uploadEvent_ = function(){

	}
	Editor.prototype.enterDocument();



}(jQuery));
