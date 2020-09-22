import aop from '@aop';

aop.advise(Math, 'ramdom', [{
  before (v) {
    console.log('种子参数为', v);
  }
}]);

Math.ramdom(10);