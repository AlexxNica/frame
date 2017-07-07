var tape = require('tape'),
	Frame = require('../lib/frame');

tape("join to smaller frame produces correct virtual column", function(t){
	t.plan(1);
	var frame0 = new Frame({
		"value0" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	//console.log(JSON.stringify(frame0._cols));
	var frame1 = new Frame({
		"value1" : [1, 2]
	});

	var link = [0, 0, 0, 1, 1, 0, 1, 0, 1];

	var joined = frame0.join(frame1, link);

	var expected = [1, 1, 1, 2, 2, 1, 2, 1, 2]; // 1 + 1 + 1 + 2 + 2 + 1 + 2 + 1 + 2

	var actual = joined["value1"];

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

});

tape("join to smaller frame produces correct sum", function(t){
	t.plan(1);
	var frame0 = new Frame({
		"value0" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var frame1 = new Frame({
		"value1" : [1, 2]
	});

	var link = [0, 0, 0, 1, 1, 0, 1, 0, 1];

	var joined = frame0.join(frame1, link);

	var expected = 13; // 1 + 1 + 1 + 2 + 2 + 1 + 2 + 1 + 2

	var actual = joined.sum("value1");

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

});

tape("join to larger frame produces correct virtual column", function(t){
	t.plan(1);
	var frame0 = new Frame({
		"value0" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	//console.log(JSON.stringify(frame0._cols));
	var frame1 = new Frame({
		"value1" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	});

	var link = [9, 1, 12, 2, 3, 7, 10, 5, 11];

	var joined = frame0.join(frame1, link);

	var expected = [10, 2, 13, 3, 4, 8, 11, 6, 12]; // 1 + 1 + 1 + 2 + 2 + 1 + 2 + 1 + 2

	var actual = joined["value1"];

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

});

tape("join to larger frame produces correct argmax and argmin", function(t){
	t.plan(2);
	var frame0 = new Frame({
		"value0" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	//console.log(JSON.stringify(frame0._cols));
	var frame1 = new Frame({
		"value1" : [5, 2, 13, 4, 6, 1, 7, 8, 9, 10, 11, 12, 3]
	});

	var link = [9, 3, 12, 2, 1, 7, 10, 5, 11];

	var joined = frame0.join(frame1, link);

	var expected = 3;

	var actual = joined.argmax("value1");

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

	var expected = 7;

	var actual = joined.argmin("value1");

	t.equals(JSON.stringify(actual), JSON.stringify(expected));
});

tape("join to larger frame produces correct sum", function(t){
	t.plan(1);
	var frame0 = new Frame({
		"value0" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	//console.log(JSON.stringify(frame0._cols));
	var frame1 = new Frame({
		"value1" : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
	});

	var link = [9, 1, 12, 2, 3, 7, 10, 5, 11];

	var joined = frame0.join(frame1, link);

	var expected = 69; // 10 + 2 + 13 + 3 + 4 + 8 + 11 + 6 + 12

	var actual = joined.sum("value1");

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

});

/*
tape("groupby has correct index", function(t){
	t.plan(1);
	var frame = new Frame({
		"id"  : [0, 0, 0, 1, 1, 0, 1, 0, 1],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = {
		"0" : [0, 1, 2, 5, 7],
		"1" : [3, 4, 6, 8]
	};

	var g = frame.groupby("id");
	var actual = g._index;

	t.equals(JSON.stringify(actual), JSON.stringify(expected));

});

tape("groupby with two arguments has correct index", function(t){
	t.plan(1);
	var frame = new Frame({
		"id_0"  : [0, 0, 0, 1, 1, 0, 1, 0, 1],
		"id_1"  : [0, 0, 1, 1, 0, 0, 1, 0, 1],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = {
		"0" : {
			"0" : [0, 1, 5, 7],
			"1" : [2]
		},
		"1" : {
			"0" : [4],
			"1" : [3, 6, 8]
		}
	};

	var g = frame.groupby("id_0", "id_1");
	var actual = g._index;

	t.equals(JSON.stringify(actual), JSON.stringify(expected));
});

tape("successive groupby has correct index", function(t){
	t.plan(1);
	var frame = new Frame({
		"id_0"  : [0, 0, 0, 1, 1, 0, 1, 0, 1],
		"id_1"  : [0, 0, 1, 1, 0, 0, 1, 0, 1],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = {
		"0" : {
			"0" : [0, 1, 5, 7],
			"1" : [2]
		},
		"1" : {
			"0" : [4],
			"1" : [3, 6, 8]
		}
	};

	var g = frame.groupby("id_0");
	g = g.groupby("id_1");
	var actual = g._index;

	t.equals(JSON.stringify(actual), JSON.stringify(expected));
});

*/
/*
var dataDirectory = 'test/data/groupby.count/',
	testFile = 'small.json';

var RTOL = 1e-05, // 1e-05
	ATOL = 1e-12; // 1e-12

var floader = require('floader'),
	dtest = require('../lib/test');

floader.load(dataDirectory + testFile, function(err, config){

	var suite = JSON.parse(config);

	for(var i = 0; i < suite.length; i++){

		var prefix = String("0000" + (i + 1)).slice(-4);

		// directory containing matrix data files for current test
		var directory = dataDirectory + prefix + '/';

		var test = suite[i];
		var names = test.id.map(function(spec, i){ return "id_" + i;});
		var types = test.id.map(function(spec, i){ return spec['type'];});

		var N = test.N; // number of rows
		distincts = test.id.map(function(spec, i){ return spec.K; });

		var testName = "groupby.count: " + N + " x " + "(" + distincts.join(", ") + ")"
		tape(testName, generateTestCase(directory, names, types, ["value_0"], [test.value[0].type]));
	}
});

function generateTestCase(directory, id_names, id_types, value_names, value_types){
	return function(t){
		t.plan(1);

		var names = id_names.concat(value_names);
		var types = id_types.concat(value_types);
		// load columns from files
		dtest.load(directory, names, types, function(err, columns){

			floader.load(directory + "out.json", function(err, out){
				var expected = JSON.parse(out);

				var column_set = {};
				for (var i = 0; i < names.length; i++){
					var name = names[i];
					var column = columns[i];
					column_set[name] = column;
				}
				var frame = new Frame(column_set);

				var g = frame;
				for(var i = 0; i < id_names.length; i++){
					id_name = id_names[i];
					g = g.groupby(id_name);
				}
				var actual = g.count();

				var assert;
				if(value_types[0] in dtest.float_types){
					assert = dtest.assert.tree.allclose;
				} else {
					assert = dtest.assert.tree.equal;
				}

				assert(t, actual, expected, null, RTOL, ATOL);
			});

		});
	};
}
*/
