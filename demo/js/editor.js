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
		this.$element_.on('click', '.text-strage-btn', this.saveModal_
				.bind(this));
		this.$element_.on('keydown', this.keydownFunction_.bind(this));
		this.$element_.on('click', '.reading-btn',this.readingText_.bind(this));
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

		}
	}

	Editor.prototype.inputTextData_ = function(textData) {
		var title = $(".editor-title").val()
		var text = $(".editor-form").val()
		// 一応タグを使えないように置き換える
		text = text.split("<").join("&lt;");
		text = text.split(">").join("&gt;");
		// 改行を改行タグに置き換える
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
				this.showConfirmDialog_();
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
				title : ""
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

	Editor.prototype.showConfirmDialog_ = function() {
		$('#staticModal').modal('show');
	}
	Editor.prototype.saveModal_ = function() {
		$('#staticModal').modal('hide');
		window.alert("保存しました");
		this.saveTextData_();
		event.stopPropagation();
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
			;
			if (type === 'UNKNOWN') {
				if (part === '記号') {
				} else {
					$(".alert-list").append('<li><span class = "label label-danger">辞書に登録されていない文字です。</span></li>')

				}

			} else if (type == 'KNOWN') {
				if (part === '記号') {

					if (detail === 'アルファベット') {
						$(".alert-list").append('<li><span class = "label label-info">アルファベットが含まれています。</span></li>')
					} else if (detail === '句点' && lastPart === '動詞') {
						$(".alert-list").append('<li><span class = "label label-warning">句点の位置がおかしい可能性があります。</span></li>')
					}
				} else if (part === '動詞') {
					if (lastPart === "動詞") {
						$(".alert-list").append('<li><span class = "label label-warning">動詞が続いています。</span></li>')
					} else if (detail === '非自立') {
						if (lastPart === '名詞') {
							$(".alert-list").append(
									'<li><span class = "label label-warning">名詞の後に非自立品詞が入っています。</span></li>')
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

		var obj1 = document.getElementById("selfile");

		//ダイアログでファイルが選択された時
		obj1.addEventListener("change",function(evt){

		  var file = evt.target.files;

		  //FileReaderの作成
		  var reader = new FileReader();
		  //テキスト形式で読み込む
		  reader.readAsText(file[0]);

		  //読込終了後の処理
		  reader.onload = function(ev){
		    //テキストエリアに表示する
		    document.test.txt.value = reader.result;
		  }
		},false);

	}

	Editor.prototype.enterDocument();

}(jQuery));
