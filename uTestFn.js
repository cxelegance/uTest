/*
 * uTestFn: a very simple unit testing library for JavaScript.
 *
 * https://github.com/cxelegance/uTestFn
 */

if(typeof uTestFn != 'undefined') throw 'uTestFn is already defined in this scope!';

/**
 * Responsible for attaching a unit testing method to a provided function, as well as two arrays for
 * inputs and expected outputs.
 * NOTE: wanted to make this a class, but haven't yet discovered a nice way to construct a function (rather than an object)
 *       that has its prototype set to this class' prototype; used Object.setPrototypeOf(fn, function(){}) which resulted in
 *       an object/function that was callable (the original fn provided) and that was an instance of Object but not Function,
 *       and therefore was missing essential prototypical Function methods such as apply().
 *       Useful info: https://stackoverflow.com/a/1978474
 *
 * @param  callable fn A function to bind the method and properties to.
 *
 * @return callable The same function, but with method uTest(), and arrays uTestInputs and uTestOutputs attached.
 */
var uTestFn = function uTestFn(fn){
	var method = {
		/**
		 * Responsible for testing *this* – a function with this uTest() method bound to it – by applying a series of inputs and
		 * comparing each result with a desired output. The inputs should be pushed onto this.uTestInputs and the outcomes pushed
		 * onto this.uTestOutputs; the inputs should be pushed as arrays of parameters, while the outputs should not be wrapped in
		 * arrays; if *this* function implements checks for boolean this.isDebug, then debugging level can be turned on with the
		 * isDebug parameters to the uTest() method;
		 * NOTE if your function calls itself, you must yourFunction.call(this, ...)!
		 *
		 * @param  int|undefined     iTest       The index of a specific input to test; by default all inputs are tested.
		 * @param  boolean|undefined isToConsole Default false; if true then outputs test details to console.
		 * @param  boolean|undefined isDebug     Default false; if true then will attempt to turn debugging on in *this* function.
		 *
		 * @return boolean True iff all tests run pass.
		 */
		uTest: function uTest (iTest, isConsoleLog, isDebug){
			var i, iStop, isPass, isFullPass = true, outcome, params;

			if(isDebug === true) this.isDebug = true;

			if(typeof iTest == 'number'){
				i = iTest;
				iStop = Math.min(i + 1, this.uTestInputs.length);
			}else{
				i = 0;
				iStop = this.uTestInputs.length;
			}

			if(this.uTestInputs.length == 0 || this.uTestOutputs.length == 0){
				throw 'uTest: missing either testInputs or testOutputs';
			}
			if(this.uTestInputs.length != this.uTestOutputs.length){
				throw 'uTest: number of testInputs does not match number of testOutputs';
			}

			for(i; i < iStop; i++){
				params = this.uTestInputs[i];
				outcome = JSON.stringify(this.apply(this, params));
				isPass = JSON.stringify(this.uTestOutputs[i]) == outcome;
				isFullPass = isPass && isFullPass;
				if(isConsoleLog === true) console.log(
					'test ' + i + '; ' +
					(isPass ? 'pass' : 'FAIL') + '; ' +
					'params: ' + JSON.stringify(params) + '; ' +
					'output: ' + outcome + '; ' +
					'expected: ' + JSON.stringify(this.uTestOutputs[i])
				);
			}

			delete this.isDebug;

			return isFullPass;
		}
	};

	fn.uTest = method.uTest.bind(fn);
	fn.uTestInputs = [];
	fn.uTestOutputs = [];

	return fn;
};
