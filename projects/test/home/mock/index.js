import mock from '@lib/mock.js';

mock.get('/getdata', () => mock.result({
  data: [{
    title: '项目一',
    value: 'value1',
  }, {
    title: '项目二',
    value: 'value2',
  }],
}), { timeout: 2000 });

mock.get('/gettree', () => mock.result({
  data: [{
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [{
      value: '0-0-1',
      key: '0-0-1',
      scopedSlots: { // custom title
        title: 'title',
      },
    }, {
      title: 'Child Node2',
      value: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  }],
}), { timeout: 2000 });

mock.get('/remote/vali', ({ value = '' }) => {
  const flag = ['北京', '上海', '深圳'].some((item) => item === value);
  return {
    code: flag ? 0 : 1000,
    msg: flag ? void 0 : '不包含在北京、上海、深圳中',
  };
});

mock.get('/get/fishbone', () => ({
  code: 0,
  data: {
    left: [{
      id: 'celiang',
      label: '测量',
      children: [{
        id: 'celianglef1',
        label: '卡苏尔xxx',
      }, {
        id: 'celiangleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'celiangleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'celiangleft4',
        label: '根本原因zzz',
      }, {
        id: 'celiangleft5',
        label: '根本原因ooo',
      }, {
        id: 'celiangleft8',
        label: '根本原因wwww',
      }, {
        id: 'celiangleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'huanjing',
      label: '环境',
      children: [{
        id: 'huanjinglef1',
        label: '卡苏尔xxx',
      }, {
        id: 'huanjingleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'huanjingleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'huanjingleft4',
        label: '根本原因zzz',
      }, {
        id: 'huanjingleft5',
        label: '根本原因ooo',
      }, {
        id: 'huanjingleft6',
        label: '根本原因tttt',
      }, {
        id: 'huanjingleft7',
        label: '根本原vvvvv',
      }, {
        id: 'huanjingleft8',
        label: '根本原因wwww',
      }, {
        id: 'huanjingleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'fangfa',
      label: '方法',
      children: [{
        id: 'fangfalef1',
        label: '卡苏尔xxx',
      }, {
        id: 'fangfaleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'fangfaleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'fangfaleft4',
        label: '根本原因zzz',
      }, {
        id: 'fangfaleft5',
        label: '根本原因ooo',
      }, {
        id: 'fangfaleft6',
        label: '根本原因tttt',
      }, {
        id: 'fangfaleft7',
        label: '根本原vvvvv',
      }, {
        id: 'fangfaleft8',
        label: '根本原因wwww',
      }, {
        id: 'fangfaleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'yongliao',
      label: '用料',
      children: [{
        id: 'yongliaolef1',
        label: '卡苏尔xxx',
      }, {
        id: 'yongliaoleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'yongliaoleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'yongliaoleft4',
        label: '根本原因zzz',
      }, {
        id: 'yongliaoleft5',
        label: '根本原因ooo',
      }, {
        id: 'yongliaoleft6',
        label: '根本原因tttt',
      }, {
        id: 'yongliaoleft7',
        label: '根本原vvvvv',
      }, {
        id: 'yongliaoleft8',
        label: '根本原因wwww',
      }, {
        id: 'yongliaoleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'jiqi',
      label: '机器',
      children: [{
        id: 'jiqilef1',
        label: '卡苏尔xxx',
      }, {
        id: 'jiqileft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'jiqileft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'jiqileft4',
        label: '根本原因zzz',
      }, {
        id: 'jiqileft5',
        label: '根本原因ooo',
      }, {
        id: 'jiqileft6',
        label: '根本原因tttt',
      }, {
        id: 'jiqileft7',
        label: '根本原vvvvv',
      }, {
        id: 'jiqileft8',
        label: '根本原因wwww',
      }, {
        id: 'jiqileft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'renshou',
      label: '人手',
      children: [{
        id: 'renshoulef1',
        label: '卡苏尔xxx',
      }, {
        id: 'renshouleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'renshouleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'renshouleft4',
        label: '根本原因zzz',
      }, {
        id: 'renshouleft5',
        label: '根本原因ooo',
      }, {
        id: 'renshouleft6',
        label: '根本原因tttt',
      }, {
        id: 'renshouleft7',
        label: '根本原vvvvv',
      }, {
        id: 'renshouleft8',
        label: '根本原因wwww',
      }, {
        id: 'renshouleft9',
        label: '根本原mmmm',
      }],
    }],
    right: [{
      id: 'celiang',
      label: '测量',
      children: [{
        id: 'celianglef1',
        label: '卡苏尔xxx',
      }, {
        id: 'celiangleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'celiangleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'celiangleft4',
        label: '根本原因zzz',
      }, {
        id: 'celiangleft5',
        label: '根本原因ooo',
      }, {
        id: 'celiangleft6',
        label: '根本原因tttt',
      }, {
        id: 'celiangleft7',
        label: '根本原vvvvv',
      }, {
        id: 'celiangleft8',
        label: '根本原因wwww',
      }, {
        id: 'celiangleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'huanjing',
      label: '环境',
      children: [{
        id: 'huanjinglef1',
        label: '卡苏尔xxx',
      }, {
        id: 'huanjingleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'huanjingleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'huanjingleft4',
        label: '根本原因zzz',
      }, {
        id: 'huanjingleft5',
        label: '根本原因ooo',
      }, {
        id: 'huanjingleft6',
        label: '根本原因tttt',
      }, {
        id: 'huanjingleft7',
        label: '根本原vvvvv',
      }, {
        id: 'huanjingleft8',
        label: '根本原因wwww',
      }, {
        id: 'huanjingleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'fangfa',
      label: '方法',
      children: [{
        id: 'fangfalef1',
        label: '卡苏尔xxx',
      }, {
        id: 'fangfaleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'fangfaleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'fangfaleft4',
        label: '根本原因zzz',
      }, {
        id: 'fangfaleft5',
        label: '根本原因ooo',
      }, {
        id: 'fangfaleft6',
        label: '根本原因tttt',
      }, {
        id: 'fangfaleft7',
        label: '根本原vvvvv',
      }, {
        id: 'fangfaleft8',
        label: '根本原因wwww',
      }, {
        id: 'fangfaleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'yongliao',
      label: '用料',
      children: [{
        id: 'yongliaolef1',
        label: '卡苏尔xxx',
      }, {
        id: 'yongliaoleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'yongliaoleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'yongliaoleft4',
        label: '根本原因zzz',
      }, {
        id: 'yongliaoleft5',
        label: '根本原因ooo',
      }, {
        id: 'yongliaoleft6',
        label: '根本原因tttt',
      }, {
        id: 'yongliaoleft7',
        label: '根本原vvvvv',
      }, {
        id: 'yongliaoleft8',
        label: '根本原因wwww',
      }, {
        id: 'yongliaoleft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'jiqi',
      label: '机器',
      children: [{
        id: 'jiqilef1',
        label: '卡苏尔xxx',
      }, {
        id: 'jiqileft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'jiqileft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'jiqileft4',
        label: '根本原因zzz',
      }, {
        id: 'jiqileft5',
        label: '根本原因ooo',
      }, {
        id: 'jiqileft6',
        label: '根本原因tttt',
      }, {
        id: 'jiqileft7',
        label: '根本原vvvvv',
      }, {
        id: 'jiqileft8',
        label: '根本原因wwww',
      }, {
        id: 'jiqileft9',
        label: '根本原mmmm',
      }],
    }, {
      id: 'renshou',
      label: '人手',
      children: [{
        id: 'renshoulef1',
        label: '卡苏尔xxx',
      }, {
        id: 'renshouleft2',
        label: '根本原因xxxx',
        hightlight: true,
      }, {
        id: 'renshouleft3',
        label: '根本原因yyyy',
        hightlight: true,
      }, {
        id: 'renshouleft4',
        label: '根本原因zzz',
      }, {
        id: 'renshouleft5',
        label: '根本原因ooo',
      }, {
        id: 'renshouleft6',
        label: '根本原因tttt',
      }, {
        id: 'renshouleft7',
        label: '根本原vvvvv',
      }, {
        id: 'renshouleft8',
        label: '根本原因wwww',
      }, {
        id: 'renshouleft9',
        label: '根本原mmmm',
      }],
    }],
  },
}));
