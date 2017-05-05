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

	}

	Editor.prototype.titleClick_ = function() {
		window.alert("test");
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
		if (confirmed === true) {
			this.saveTextData_(textData);
		} else {
			if (textData.title === "" || textData.text === "") {
				this.showConfirmDialog_(textData);
				event.stopPropagation();
			} else {
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
				text : "",
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

	Editor.prototype.showConfirmDialog_ = function(textData) {
		$('#staticModal').modal('show');
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
		var lastPart = null;
		this.initializeAlertarea_();

		for (var i = 0; i < data.length; i++) {

			var part = data[i].pos;
			var word = data[i].surface_form;
			var detail = data[i].pos_detail_1;
			var detailTwo = data[i].pos_detail_2;
			var type = data[i].word_type;
			var position = data[i].ward_position;
			;
			if (type === 'UNKNOWN') {
				if (part === '記号') {
				} else {
					$(".alert-list").append('<li class ="validate-label"><span class = "label label-danger">辞書に登録されていない文字です。</span></li>')

				}

			} else if (type == 'KNOWN') {
				if (part === '記号') {

					if (detail === 'アルファベット') {
						$(".alert-list").append('<li class  ="validate-label"><span class = "label label-info">アルファベットが含まれています。</span></li>')
					} else if (detail === '句点' && lastPart === '動詞') {
						$(".alert-list").append('<li class  ="validate-label"><span class = "label label-warning">句点の位置がおかしい可能性があります。</span></li>')
					}
				} else if (part === '動詞') {
					if (lastPart === "動詞") {
						$(".alert-list").append('<li class  ="validate-label"><span class = "label label-warning">動詞が続いています。</span></li>')
					} else if (detail === '非自立') {
						if (lastPart === '名詞') {
							$(".alert-list").append(
									'<li class  ="validate-label"><span class = "label label-warning">名詞の後に非自立品詞が入っています。</span></li>')
						}
					}

				} else if (part === '名刺') {

				}
			}
			lastPart = part;

		}
	}

	Editor.prototype.initializeAlertarea_ = function() {
		$(".alert-list").children("li").remove();
	}

	Editor.prototype.readingText_ = function(){

		var filebtn = document.getElementById("selfile");
		var newFilebtn = document.getElementById("new-selfile");

		//ダイアログでファイルが選択された時
		filebtn.addEventListener("change",function(evt){

		  var file = evt.target.files;

		  //FileReaderの作成
		  var reader = new FileReader();
		  //テキスト形式で読み込む
		  reader.readAsText(file[0]);

		  //読込終了後の処理
		  reader.onload = function(ev){
		    //テキストエリアに表示する
			$(".origin-editor-title").val(file[0].name);
		    document.test.txt.value = reader.result;
		  }
		},false);

		newFilebtn.addEventListener("change",function(evt){

			  var file = evt.target.files;

			  //FileReaderの作成
			  var reader = new FileReader();
			  //テキスト形式で読み込む
			  reader.readAsText(file[0]);

			  //読込終了後の処理
			  reader.onload = function(ev){
			    //テキストエリアに表示する
				$(".minutes-editor-title").val(file[0].name);
			    $("#minutes-textarea").val(reader.result);
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
		var textData = this.inputTextData_(textData);
	}
	Editor.prototype.beforUnloadEvent_ = function(){

	}
	Editor.prototype.enterDocument();



}(jQuery));
