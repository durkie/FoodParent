﻿module FoodParent {

    export class UpdateTreeFlag implements Command {
        private _tree: Tree;
        private _flag: number;
        private _previousFlag: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeFlag = this;
            if (args != undefined && args.tree != undefined && args.flag != undefined) {
                self._tree = args.tree;
                self._flag = args.flag;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeFlag = this;
            self._previousFlag = self._tree.getFlagId();
            self._tree.save(
                {
                    'flag': self._flag,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Status has changed from '" + Model.getFlags().findWhere({ id: self._previousFlag }).getName()
                            + "' to '" + Model.getFlags().findWhere({ id: self._flag }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeFlag = this;
            self._tree.save(
                {
                    'flag': self._previousFlag,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeOwnership implements Command {
        private _tree: Tree;
        private _ownership: number;
        private _previousOwnership: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeOwnership = this;
            if (args != undefined && args.tree != undefined && args.ownership != undefined) {
                self._tree = args.tree;
                self._ownership = args.ownership;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeOwnership = this;
            self._previousOwnership = self._tree.getOwnershipId();
            self._tree.save(
                {
                    'ownership': self._ownership,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Ownership has changed from '" + Model.getOwnerships().findWhere({ id: self._previousOwnership }).getName()
                            + "' to '" + Model.getOwnerships().findWhere({ id: self._ownership }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeOwnership = this;
            self._tree.save(
                {
                    'ownership': self._previousOwnership,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeLocation implements Command {
        private _tree: Tree;
        private _marker: L.Marker;
        private _location: L.LatLng;
        private _prevLocation: L.LatLng;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeLocation = this;
            if (args != undefined && args.tree != undefined && args.location != undefined) {
                self._tree = args.tree;
                self._location = args.location;
            }
            if (args.marker) {
                self._marker = args.marker;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeLocation = this;
            self._prevLocation = self._tree.getLocation();
            self._tree.save(
                {
                    'lat': self._location.lat,
                    'lng': self._location.lng
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Location has changed from '@ " + self._prevLocation.lat.toFixed(4) + ", " + self._prevLocation.lng.toFixed(4)
                            + "' to '" + '@ ' + self._location.lat.toFixed(4) + ", " + self._location.lng.toFixed(4) + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeLocation = this;
            self._tree.save(
                {
                    'lat': self._prevLocation.lat,
                    'lng': self._prevLocation.lng
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                                if (self._marker) {
                                    self._marker.setLatLng(self._prevLocation);
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeFoodType implements Command {
        private _tree: Tree;
        private _food: number;
        private _previousFood: number;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeFoodType = this;
            if (args != undefined && args.tree != undefined && args.food != undefined) {
                self._tree = args.tree;
                self._food = args.food;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeFoodType = this;
            self._previousFood = self._tree.getFoodId();
            self._tree.save(
                {
                    'food': self._food,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Food type has changed from '" + Model.getFoods().findWhere({ id: self._previousFood }).getName()
                            + "' to '" + Model.getFoods().findWhere({ id: self._food }).getName() + "'",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeFoodType = this;
            self._tree.save(
                {
                    'food': self._previousFood,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class UpdateTreeDescription implements Command {
        private _tree: Tree;
        private _description: string;
        private _previousDescription: string;
        private _success: Function;
        private _error: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: UpdateTreeDescription = this;
            if (args != undefined && args.tree != undefined && args.description != undefined) {
                self._tree = args.tree;
                self._description = args.description;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: UpdateTreeDescription = this;
            self._previousDescription = self._tree.getDescription();
            self._tree.save(
                {
                    'description': self._description,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Description has changed.",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: UpdateTreeDescription = this;
            self._tree.save(
                {
                    'description': self._previousDescription,
                },
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getNotes().remove(self._note);
                        self._note.destroy({
                            wait: true,
                            success: function (note: Note, response: any) {
                                if (self._success) {
                                    self._success();
                                }
                            },
                            error: function (error) {
                                if (self._error) {
                                    self._error();
                                }
                            },
                        });
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
    }

    export class AddNewTree implements Command {
        private _tree: Tree;
        private _success: Function;
        private _error: Function;
        private _undoSuccess: Function;
        private _note: Note;
        constructor(args?: any, success?: Function, error?: Function, undoSuccess?: Function) {
            var self: AddNewTree = this;
            if (args != undefined && args.tree != undefined) {
                self._tree = args.tree;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
            if (undoSuccess) {
                self._undoSuccess = undoSuccess;
            }
        }
        public execute(): any {
            var self: AddNewTree = this;
            self._tree.save(
                {},
                {
                    wait: true,
                    success: function (tree: Tree, response: any) {
                        Model.getTrees().add(self._tree);
                        self._note = new Note({
                            type: NoteType.INFO,
                            tree: self._tree.getId(),
                            person: 0,
                            comment: "Tree has been added.",
                            picture: "",
                            rate: -1,
                            date: moment(new Date()).format(Setting.getDateTimeFormat()),
                        });
                        self._note.save(
                            {},
                            {
                                wait: true,
                                success: function (note: Note, response: any) {
                                    Model.getNotes().add(note);
                                    if (self._success) {
                                        self._success();
                                    }
                                },
                                error: function (error) {
                                    if (self._error) {
                                        self._error();
                                    }
                                },
                            }
                        );
                    },
                    error: function (error, response) {
                        if (self._error) {
                            self._error();
                        }
                    },
                }
            );
        }
        public undo(): any {
            var self: AddNewTree = this;
            Model.getTrees().remove(self._tree);
            self._tree.destroy({
                wait: true,
                success: function (note: Note, response: any) {
                    Model.getNotes().remove(self._note);
                    self._note.destroy({
                        wait: true,
                        success: function (note: Note, response: any) {
                            if (self._undoSuccess) {
                                self._undoSuccess();
                            }
                        },
                        error: function (error) {
                            if (self._error) {
                                self._error();
                            }
                        },
                    });
                },
                error: function (error) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        }
    }

    export class DeleteTree implements Command {
        private _tree: Tree;
        private _success: Function;
        private _error: Function;
        constructor(args?: any, success?: Function, error?: Function) {
            var self: DeleteTree = this;
            if (args != undefined && args.tree != undefined) {
                self._tree = args.tree;
            }
            if (success) {
                self._success = success;
            }
            if (error) {
                self._error = error;
            }
        }
        public execute(): any {
            var self: DeleteTree = this;
            Model.getTrees().remove(self._tree);
            self._tree.destroy({
                wait: true,
                success: function (note: Note, response: any) {
                    if (self._success) {
                        self._success();
                    }
                },
                error: function (error) {
                    if (self._error) {
                        self._error();
                    }
                },
            });
        }
        public undo(): any {

        }
    }

}