var _ = require('lodash');

////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getChangedJson = function(old_json, new_json) {
	var change_json = {};
	var self = this;

	for (var key in old_json) {
		if (new_json.hasOwnProperty(key)) {
			if (old_json[key].constructor != new_json[key].constructor) {
				change_json[key] = new_json[key];
			} else {
				change_json = self.compareJsonObejct(old_json[key], new_json[key], change_json, key);
			}
		} else {
			console.log('该字段被删除');
		}
	}

	return change_json;
};

exports.compareJsonObejct = function(old_obj, new_obj, change_json, key) {
	if (old_obj.constructor == Object) {
		if (JSON.stringify(new_obj) != JSON.stringify(old_obj)) {
			change_json[key] = new_obj;
		}
	} else if (old_obj.constructor == Array) {
		if (this.isJsonArrayItemObj(old_obj, new_obj)) {
			change_json[key] = this.getChangedFromObjArray(old_obj, new_obj);
		} else {
			change_json[key] = new_obj;
		}
	} else {
		if (old_obj != new_obj) {
			change_json[key] = new_obj;
		}
	}

	return change_json;
};

/*
 * 判断该json数组每一项是不是object
 */
exports.isJsonArrayItemObj = function(old_array, new_array) {
	var item_is_obj = false;
	var array_temp = old_array.length > 0 ? old_array : new_array;

	if (array_temp.length > 0 && array_temp[0].constructor == Object) {
		item_is_obj = true;
	}
	return item_is_obj;
};

/*
 * 获取两个json数组中的改变值列表
 */
exports.getChangedFromObjArray = function(old_array, new_array) {
	var id_name = this.getIdName(old_array, new_array);
	var change_json = [];
	var union_array = _.unionWith(new_array, old_array, _.isEqual);

	// 获取新增的数据(包括修改)
	var add_array = _.cloneDeep(union_array);
	_.pullAllWith(add_array, old_array, _.isEqual);

	// 获取删除的数据
	var remove_array = _.cloneDeep(union_array);
	_.pullAllWith(remove_array, new_array, _.isEqual);
	_.pullAllBy(remove_array, add_array, id_name);

	_.each(add_array, function(item) {
		change_json.push(item);
	});

	_.each(remove_array, function(item) {
		var delete_item = {};
		delete_item[id_name] = item[id_name];
		delete_item.del = 1;
		change_json.push(delete_item);
	});

	return change_json;
};

exports.getIdName = function(old_array, new_array) {
	var id_name = '';
	var array_temp = old_array.length > 0 ? old_array : new_array;
	if (array_temp.length > 0) {
		let first_obj = array_temp[0];
		for (let key in first_obj) {
			if (key.toString().indexOf('_id') >= 0) {
				id_name = key;
			}
		}
	}

	return id_name;
};
