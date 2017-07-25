(function($) {

	Sidemenu = function() {
		this.$element_;
		inst = inst || {};
		this.events_ = [];
		this.enterDocument();

	};

	Sidemenu.prototype.getElement = function() {
		return this.$element_;
	};

	Sidemenu.prototype.enterDocument = function() {
		this.$element_ = $(document);
		this.bindEvents_();
		this.initialEvents_();
	}
	Sidemenu.prototype.exitDocument = function() {
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

	Sidemenu.prototype.bindEvents_ = function() {
		this.$element_.on('click', '.option-watch', this.watchAreaToggle_.bind(this));
		this.$element_.on('click', '.read-format', this.readFormat_.bind(this));
		this.$element_.on('click', '#create-format-btn', this.createFormat_.bind(this));
		this.$element_.on('click', '.remove-icon', this.removeFormat_.bind(this));
		this.$element_.on('click', '.create-format', this.readFormatText_.bind(this));
		this.$element_.on('click', '.toggle-origin-edit', this.toggleOriginEdit_.bind(this));
	}

	Sidemenu.prototype.watchAreaToggle_ = function() {
		$(".watch-area").fadeToggle();
	}

	Sidemenu.prototype.readFormat_ = function(e) {
		var target = e.target;
		if ($(target).hasClass("side-dropdown-menu")) {
			this.dropFormat_();
			return;
		}
		else if($(target).hasClass("create-format-icon")){
			this.createFormatModal_();
			return;
		}

		var $text = $("#minutes-textarea")

		var format = "--------------------------------------\r\
日時：\r\
場所：\r\
\r\
（以下、敬称略）\r\
出席者：\r\
欠席者：\r\
議事録：\r\
-------------------------------------"
		if ($text.val !== ("")) {
			format = format + '\r' + $text.val();
			$text.val(format);

		} else {
			$text.val(format);
		}
	}

	Sidemenu.prototype.dropFormat_ = function() {
		$(".hidden-menu").slideToggle();
	}

	Sidemenu.prototype.createFormatModal_ = function() {
		$('#formatModal').modal('show');

	}

	Sidemenu.prototype.createFormat_ = function() {
		$('#formatModal').modal('hide');
		$(".hidden-menu").slideDown();
		this.changeFormatMode_();
	}

	Sidemenu.prototype.saveFormat = function() {
		var title = $(".minutes-editor-title").val()
		var text = $("#minutes-textarea").val()
		var lineNo = $(".create-format:last").index()
		var formatKey;
		text = text.split("<").join("&lt;");
		text = text.split(">").join("&gt;");
		text = text.split("\n").join("\r\n");
		format = {
			text : text,
			title : title
		}

		if(lineNo === -1){
		lineNo = 0;
		localStorage.setItem("format" + lineNo, JSON.stringify(format));
		}
		else{
			localStorage.setItem("format" + lineNo, JSON.stringify(format));
		}
		formatKey = "format" + lineNo;
		window.alert("フォーマットを保存しました")
		this.changeFormatMode_();
		this.newLineFormat_(format,lineNo,formatKey);
	}


	Sidemenu.prototype.removeFormat_ = function(e) {
		var target = e.target;
		var index = $(".create-format").index()
		var key = $(target).parents(".create-format").data('key');
		localStorage.removeItem(key);
		this.deleteLineFormat_(target);
	}

	Sidemenu.prototype.changeFormatMode_ = function() {
		var $minutesTextArea = $("#minutes-textarea")
		var $saveBtn = $(".save-file-btn")

		if($minutesTextArea.hasClass("format-form")){
			$saveBtn.removeClass("format-seve-btn")
			$minutesTextArea.removeClass("format-form");
		}
		else{
			$minutesTextArea.addClass("format-form");
			$saveBtn.addClass("format-seve-btn");
			$(".minutes-editor-title").attr("placeholder", "フォーマットのタイトルを記入してください");
		}
	}


	Sidemenu.prototype.initialGetStrage_ = function(){
		var lineNo = 0;
		var formatKey = "format" + lineNo;
		var format = localStorage.getItem(formatKey);
		var lollength = localStorage.length;

		for (var i = 0; i <= localStorage.length; i++){
			this.initialReadFormat_(format,lineNo,formatKey);
			lineNo++;
			formatKey = "format" + lineNo;
			format = localStorage.getItem(formatKey);
		}


	}

	Sidemenu.prototype.initialReadFormat_ = function(format,lineNo,formatKey){
	if (format !== null) {
		format = JSON.parse(format)
		this.newLineFormat_(format,lineNo,formatKey);
		}
	}

	Sidemenu.prototype.newLineFormat_ = function(format,lineNo,formatKey){
		var $lastFormatList = $(".create-format:last");
		var $sidemenu =$(".editor-sidemenu");
		var $readForamt = $(".read-format");

		if(format === null){
			if($sidemenu.hasClass("create-format")){
				$lastFormatList.after('<li class="sidemenu-list create-format hidden-menu" style="display: list-item;">無題<span class="glyphicon glyphicon-remove remove-icon"></span></li>')
		}
			else{
			$readForamt.after('<li class= "sidemenu-list create-format hidden-menu">- 無題</li>')
			}
		}
		else{
			if($sidemenu.hasClass("create-format")){
				$lastFormatList.after('<li class="sidemenu-list create-format hidden-menu '+formatKey+'" style="display: list-item;" data-key ='+formatKey+' > - ' + format.title + '<span class="glyphicon glyphicon-remove remove-icon"></span></li>')
		}
			else{
			$readForamt.after('<li class= "sidemenu-list create-format hidden-menu '+formatKey+'" data-key ='+formatKey+'>-' + format.title + ' <span class="glyphicon glyphicon-remove remove-icon"></span></li>')
			}
		}
		$(".hidden-menu").slideDown();
}

	Sidemenu.prototype.readFormatText_= function(e) {
		var target = e.target;
		var formatKey = $(target).data('key');
		var format = JSON.parse(localStorage.getItem(formatKey));
		$("#minutes-textarea").val(format.text);
	}

	Sidemenu.prototype.toggleOriginEdit_ = function(){
		var $btnText = $(".toggle-origin-edit")

		$('.origin-editor-area').slideToggle();
		$('.origin-sidemenu-area').slideToggle();
		if($btnText.text() === "隠す"){
			$btnText.text("表示する")
		}
			else{
				$btnText.text("隠す")
		}
	}

	Sidemenu.prototype.deleteLineFormat_ = function(target){
	$(target).parents(".create-format").remove();
	}


	Sidemenu.prototype.initialEvents_ = function(){

	$(function () {
		this.initialGetStrage_();
	}.bind(this))

	}

	Sidemenu.prototype.enterDocument();

}(jQuery));