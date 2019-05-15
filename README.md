# uTest
quick unit test for vanilla JavaScript

## Is this for you?
Most likely you should be using a mainstream unit testing library/package for JavaScript; I personally didn't have time to research and choose one – I just quickly made this.

## Is it better to quickly reinvent a wheel?
As mentioned, I didn't have time to look at the other wheels, and this here was very quick to make.  What was great for me is that I could define a function, then tack on some test inputs and some expected test outputs, then essentially say "run" and have it report any failures.  I could enter the test cases in the same file as the function I was developing, which I found convenient.

## How does it work?
First, have a function to test; e.g:

    function gcd (num1, num2){
       // if you want uTestFn to control debugging info
       var isDebug = this && this.isDebug;
       
       if(isDebug) console.log('you want the gcd of '+num1+' and '+num2+'?');
       
       // let's fail on a specific case
       if(num1 == 3 && num2 == 4) return 4; // wrong!
       else return goodTestedGCD(3, 4);
    }

Then ask uTest to prepare to test your function:

    uTestFn(gcd);

Then push some test inputs and expected outputs:

    gcd.uTestInputs.push([2, 4]);
    gcd.uTestOutputs.push(2);

    gcd.uTestInputs.push([3, 4]);
    gcd.uTestOutputs.push(1);

    gcd.uTestInputs.push([7, 14]);
    gcd.uTestOutputs.push(7);

Then run the test:

    if(!gcd.uTest()) throw 'gcd() failed at least one test!';

If one of your test cases failed, execution will stop on the thrown exception; you can then:

    gcd.uTest(null, true);

You will see a list (in console) of all tests and their pass/fail status.

    test 0; pass; params: [2,1]; output: 2; expected: "04" uTestFn.js:61:31
    test 1; FAIL; params: [3,4]; output: 4; expected: 1 uTestFn.js:61:31
    test 2; pass; params: [7,14]; output: 7; expected: 7 uTestFn.js:61:31
    false
    
You can then dig into the failed test:

    gct.uTest(2, true, true);
    
The final parameter "true" will ensure that any debugging output is shown.
