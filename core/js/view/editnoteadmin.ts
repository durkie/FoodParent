﻿module FoodParent {
    export class EditNoteViewForAdmin extends EditNoteView {
        protected static TAG: string = "EditNoteViewForAdmin - ";
        constructor(options?: Backbone.ViewOptions<Backbone.Model>) {
            super(options);
            var self: EditNoteViewForAdmin = this;
            self.bDebug = true;
            self.events = <any>{
                "click .evt-close": "_mouseClick",
                "click .evt-prev": "_prevNote",
                "click .evt-next": "_nextNote",
                "click .image-group img": "_applyCoverPicture",
                "click .evt-delete": "_mouseClick",
            };
            self.delegateEvents();
        }
        public render(args?: any): any {
            super.render(args);
            var self: EditNoteViewForAdmin = this;
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
            var template = _.template(Template.getEditNoteViewForAdmin());
            self.$el.append(template({
                header: "Tree Note",
                name: food.getName() + " " + tree.getName(),
            }));
            self.setElement($('#wrapper-post-note'));
            self.setVisible();
            self.resize();

            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();

            // Register file upload event listner
            self.addFileUploadEventListener();

            return self;
        }
        public update(args?: any): any {
            super.update(args);
            var self: EditNoteViewForAdmin = this;
            if (self.bDebug) console.log(EditNoteViewForAdmin.TAG + "update()");
            // Render note info
            self.renderNoteInfo();
            // Render pictures
            self.renderNoteImages();
        }

        public renderNoteInfo() {
            var self: EditNoteViewForAdmin = this;
            if (self.bDebug) console.log(EditNoteViewForAdmin.TAG + "renderNoteInfo()");
            var parent: Person = Model.getPersons().findWhere({ id: self._note.getPersonId() });
            var tree: Tree = Model.getTrees().findWhere({ id: self._note.getTreeId() });
            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });

            self.$('.input-rating').replaceWith('<div class="input-rating"></div>');
            self.$('.input-rating').html(Math.ceil(self._note.getRate()).toFixed(2) + " / " + Setting.getMaxRating().toFixed(2));

            self.$('.input-rating-slider').html("");
            var rate = rating(self.$('.input-rating-slider')[0], (self._note.getRate() + 1).toFixed(2), Setting.getMaxRating() + 1, function (rate) {
                if (Math.ceil(self._note.getRate()) != (rate - 1)) {
                    EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_RATING, { rate: (rate - 1) }, function () {
                        EventHandler.handleDataChange("Rating of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                        self.renderNoteInfo();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else {
                    self.renderNoteInfo();
                }
            });

            self.$('.input-amount').replaceWith('<div class="input-amount"></div>');
            var origAmount = self._note.getAmount();
            var amountLabel = (origAmount / 454).toFixed(1) + " lbs. (";
            if (origAmount > 10000) {
              amountLabel += (origAmount / 1000).toFixed(1) + " kg)";
            } else {
              amountLabel += origAmount + " grams)";
            }
            self.$('.input-amount').html(amountLabel);
            self.$('.input-amount').on('click', function (event) {
              $(this).replaceWith("<input type='number' min=0 class='input-amount form-control' value=" + self._note.getAmount() + "></input><select class='amount-unit'><option value='1'>grams</option><option value='454'>lbs.</option><option value='1000'>kg</option></select>");
              self.$('.input-amount').focus();
              self.$('.input-amount').on('focusout', function (event) {
                var amount = self.$('.input-amount').val();
                var unit = parseInt(self.$('.amount-unit').val());
                self.$('.amount-unit').remove();
                amount *= unit;
                if (self._note.getAmount() != amount) {
                  FoodParent.EventHandler.handleNoteData(self._note, FoodParent.DATA_MODE.UPDATE_NOTE_AMOUNT, { amount: amount }, function () {
                    FoodParent.EventHandler.handleDataChange("Pick amount for <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                    self.renderNoteInfo();
                  }, function () {
                      FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                  });
                }
                else {
                    self.renderNoteInfo();
                }
                self._note.setAmount(amount);
                self.renderNoteInfo();
              });
            });

            self.$('.input-comment').replaceWith('<div class="input-comment"></div>');
            self.$('.input-comment').html(htmlDecode(self._note.getComment()));
            self.$('.input-comment').on('click', function (event) {
                $(this).replaceWith("<textarea rows='5' class='input-comment form-control'>" + self._note.getComment() + "</textarea>");
                self.$('.input-comment').focus();
                self.$('.input-comment').on('focusout', function (event) {
                    var comment: string = self.$('.input-comment').val();
                    if (self._note.getComment().trim() != comment.trim()) {
                        EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_COMMENT, { comment: comment }, function () {
                            EventHandler.handleDataChange("Comment of <strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> was changed successfully.", true);
                            self.renderNoteInfo();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else {
                        self.renderNoteInfo();
                    }
                });
            });

            var today: Date = new Date();
            self.$('.text-note-date').html(self._note.getFormattedDate());
            self.$('.input-date').attr({ 'data-value': self._note.getFormattedDate() });
            self.$('.input-date').pickadate({
                format: "dd mmm yyyy",
                today: 'Today',
                max: today,
                clear: '',
                close: 'Close',
                onClose: function () {
                    EventHandler.handleNoteData(self._note, DATA_MODE.UPDATE_DATE, { date: moment(this.get()).hour(moment(new Date()).hour()).format(Setting.getDateTimeFormat()) }, function () {
                        EventHandler.handleDataChange("Date of this <strong><i>Note</i></strong> was changed successfully.", true);
                        self.renderNoteInfo();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
            });

            // Fill out name of the author
            self.$('.input-contact').html(parent.getName());
        }
    }
}
