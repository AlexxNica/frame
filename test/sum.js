var tape = require('tape'),
	Frame = require('../lib/frame');
/*
tape("groupby.sum", function(t){
	t.plan(1);
	var frame = new Frame({
		"id"  : [0, 0, 0, 1, 1, 0, 1, 0, 1],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = [10, 9];

	var g = frame.groupby("id");
	var actual = g.sum("value");

	t.equals(JSON.stringify(actual), JSON.stringify(expected), "reduce");

});

tape("groupby.sum.strings", function(t){
	t.plan(1);
	var frame = new Frame({
		"id"  : ["a", "a", "a", "b", "b", "a", "b", "a", "b"],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = [10, 9];

	var g = frame.groupby("id");
	var actual = g.sum("value");

	t.equals(JSON.stringify(actual), JSON.stringify(expected), "reduce");

});

tape("groupbymulti.sum", function(t){
	t.plan(1);
	var frame = new Frame({
		"id_0"  : [0, 0, 0, 1, 1, 0, 1, 0, 1],
		"id_1"  : [0, 0, 1, 1, 0, 0, 1, 0, 1],
		"value" : [1, 2, 2, 3, 1, 3, 4, 2, 1]
	});

	var expected = {
		"0" : {
			"0" : 8,//[0, 1, 5, 7], 1 + 2 + 3 + 2
			"1" : 2//[2]
		},
		"1" : {
			"0" : 1,//[4],
			"1" : 8//[3, 6, 8] 3 + 4 + 1
		}
	};


	var g = frame.groupbymulti(["id_0", "id_1"]);
	var actual = g.summulti("value");

	t.equals(JSON.stringify(actual), JSON.stringify(expected));
});

*/

var RTOL = 1e-05, // 1e-05
	ATOL = 1e-12; // 1e-12

var dataDirectory = 'test/data/sum/',
	testFile = 'small.json';

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
		var distincts = test.id.map(function(spec, i){ return spec.K; });

		var testName = "groupby.summulti: " + N + " x " + "(" + distincts.join(", ") + ")"
		tape(testName, generateTestCase(directory, names, types, ["value_0"], [test.value[0].type]));
	}
});

var OUT_FILENAME = "out.json";
var DEFAULT_TYPE = "int32";


function generateTestCase(directory, id_names, id_types, value_names, value_types){
	return function(t){
		t.plan(1);

		var names = id_names.concat(value_names);
		var types = id_types.concat(value_types);
		// load columns from files
		dtest.load(directory, names, types, function(err, columns){

			floader.load(directory + OUT_FILENAME, function(err, out){
				var expected = JSON.parse(out);

				var column_set = {};
				for (var i = 0; i < names.length; i++){
					var name = names[i];
					var column = columns[i];
					column_set[name] = column;
				}
				var frame = new Frame(column_set);

				var g = frame.groupbymulti(id_names);
				var actual = g.summulti(value_names[0]);

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
