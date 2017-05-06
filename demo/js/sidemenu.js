(function($) {

	Sidemenu= function() {
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



	}

	Sidemenu.prototype.watchAreaToggle_ = function(){
		$(".watch-area").fadeToggle();
	}

	Sidemenu.prototype.readFormat_ = function(){
		var $text= $("#minutes-textarea")


		var format =
"--------------------------------------\r\
日時：\r\
場所：\r\
\r\
（以下、敬称略）\r\
出席者：\r\
欠席者：\r\
議事録：\r\
-------------------------------------"
			if($text.val !==("")){
				format = format + '\r' + $text.val();
				$text.val(format);

			}
			else{
		$text.val(format);
			}
	}




Sidemenu.prototype.enterDocument();



}(jQuery));