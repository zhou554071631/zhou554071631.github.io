(function () {
    'use strict';

    var View = Laya.View;
    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class BattleViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("BattleView");
            }
        }
        ui.BattleViewUI = BattleViewUI;
        REG("ui.BattleViewUI", BattleViewUI);
        class FailViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("FailView");
            }
        }
        ui.FailViewUI = FailViewUI;
        REG("ui.FailViewUI", FailViewUI);
        class LoadingViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("LoadingView");
            }
        }
        ui.LoadingViewUI = LoadingViewUI;
        REG("ui.LoadingViewUI", LoadingViewUI);
        class VictoryViewUI extends View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("VictoryView");
            }
        }
        ui.VictoryViewUI = VictoryViewUI;
        REG("ui.VictoryViewUI", VictoryViewUI);
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class EventManager {
        constructor() { }
        static get instance() {
            if (EventManager._instance == null) {
                EventManager._instance = new EventManager();
            }
            return EventManager._instance;
        }
        init() {
            this.event = new Laya.EventDispatcher();
        }
        on(type, self, listener) {
            this.event.on(type, self, listener);
        }
        off(type, self, listener) {
            this.event.off(type, self, listener, false);
        }
        fire(type, data) {
            this.event.event(type, data);
        }
        fire2(type, data1, data2, data3) {
            let data = [];
            if (data1 != null)
                data.push(data1);
            if (data2 != null)
                data.push(data2);
            if (data3 != null)
                data.push(data3);
            this.event.event(type, data);
        }
    }

    var EventType;
    (function (EventType) {
        EventType["updateGold"] = "updateGold";
        EventType["addGold"] = "addGold";
        EventType["subPackageLoadComplete"] = "subPackageLoadComplete";
        EventType["signComplete"] = "signComplete";
        EventType["newGuide_StartNextStep"] = "newGuideStartNextStep";
        EventType["newGuide_CompleteStep"] = "newGuideCompleteStep";
        EventType["newGuide_allComplete"] = "newGuide_allComplete";
        EventType["startGame"] = "startGame";
        EventType["reset_Game"] = "reset_Game";
        EventType["stage_loadComplete"] = "stage_loadComplete";
        EventType["stage_triggerFight"] = "stage_triggerFight";
        EventType["stage_enemyDead"] = "stage_enemyDead";
        EventType["gameOver"] = "gameOver";
        EventType["hero_bloodUpdate"] = "hero_bloodUpdate";
        EventType["ui_aimTouchDown"] = "ui_aimTouchDown";
        EventType["ui_aimTouchUp"] = "ui_aimTouchUp";
        EventType["ui_openAim"] = "ui_openAim";
        EventType["ui_closeAim"] = "ui_closeAim";
        EventType["ui_shoot"] = "ui_shoot";
    })(EventType || (EventType = {}));
    var RecycleType;
    (function (RecycleType) {
        RecycleType[RecycleType["bullet"] = 0] = "bullet";
        RecycleType[RecycleType["hitEffect"] = 1] = "hitEffect";
    })(RecycleType || (RecycleType = {}));
    var MissionType;
    (function (MissionType) {
        MissionType[MissionType["thug"] = 1] = "thug";
        MissionType[MissionType["thug_suitcase"] = 2] = "thug_suitcase";
    })(MissionType || (MissionType = {}));
    var GameOverType;
    (function (GameOverType) {
        GameOverType[GameOverType["Win"] = 0] = "Win";
        GameOverType[GameOverType["shooted"] = 1] = "shooted";
        GameOverType[GameOverType["enemy_escape"] = 2] = "enemy_escape";
        GameOverType[GameOverType["hostage_shooted"] = 3] = "hostage_shooted";
    })(GameOverType || (GameOverType = {}));
    class Utils {
        static getGuid() {
            return ++Utils.GUID;
        }
        static removeArr(arr, ele) {
            var index = arr.indexOf(ele);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        }
        static stringFormat(str, args1) {
            for (var i = 0; i < args1.length; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                str = str.replace(reg, args1[i]);
            }
            return str;
        }
        static changeAngleTo360(angle) {
            if (angle > 0) {
                if (angle >= 360) {
                    angle = angle % 360;
                }
            }
            else if (angle < 0) {
                if (angle <= -360) {
                    angle = angle % 360;
                }
                angle += 360;
            }
            return angle;
        }
        static splitStrToNum(str, flag) {
            var strs = new Array();
            var result = new Array();
            strs = str.split(flag);
            for (var i = 0; i < strs.length; i++) {
                try {
                    if (strs[i] == null) {
                        break;
                    }
                    if (!isNaN(strs[i])) {
                        result[i] = JSON.parse(strs[i]);
                    }
                    else {
                        result[i] = strs[i];
                    }
                }
                catch (error) {
                    console.log("分割字符串错误：" + str + "/// " + strs[i] + "  flag = " + flag);
                }
            }
            return result;
        }
        static findChildByName(parent, childName) {
            let child = parent.getChildByName(childName);
            if (child)
                return child;
            for (let i = 0; i < parent.numChildren; i++) {
                const element = parent.getChildAt(i);
                if (element.numChildren > 0) {
                    let child = Utils.findChildByName(element, childName);
                    if (child != null) {
                        return child;
                    }
                }
            }
            return null;
        }
        static convert(num) {
            if (num < 1000) {
                return parseInt(num);
            }
            let arr = ["K", "M", "G", "B", "T", "aa", "ab", "ac", "ad", "ae", "af", "ag", "ah", "ai", "aj", "ak", "al", "am", "an", "ao", "ap", "aq", "ar", "as", "at", "au", "av", "aw", "ax", "ay", "az", "ba"];
            let str = "";
            let temp = 1000;
            let index = -1;
            while (temp < num) {
                index++;
                temp *= 1000;
            }
            if (index == -1) {
                return num;
            }
            else {
                if (index >= arr.length) {
                    return num;
                }
                else {
                    return Math.floor(100 * num * 1000 / temp) / 100 + arr[index];
                }
            }
        }
        static random(minNum, maxNum) {
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        }
        static vibrate() {
            if (Laya.Browser.onMiniGame) {
                wx.vibrateShort({ success: null, fail: null, complete: null });
            }
            else if (Laya.Browser.onQGMiniGame) {
                qg.vibrateShort({ success: null, fail: null, complete: null });
            }
            else if (Laya.Browser.onVVMiniGame) {
                qg.vibrateShort({ success: null, fail: null, complete: null });
            }
        }
        static vibrateLong() {
            if (Laya.Browser.onMiniGame) {
                wx.vibrateLong({ success: null, fail: null, complete: null });
            }
            else if (Laya.Browser.onQGMiniGame) {
                qg.vibrateLong({ success: null, fail: null, complete: null });
            }
            else if (Laya.Browser.onVVMiniGame) {
                qg.vibrateLong({ success: null, fail: null, complete: null });
            }
        }
        static shareByPath(shareType, path) {
            return;
            let p1 = "https://mmocgame.qpic.cn/wechatgame/AQ7gpWvyGT0K8r0dtO3mMDZywMvtoAlfXBGiaTYmzagxM7pRSf4qia9N3cKDViciaicgG/0";
            let p2 = "https://mmocgame.qpic.cn/wechatgame/AQ7gpWvyGT1lq49mticrbdDjkicOeBQx6N5PvjCr1EpZVJ5s6CNdvV7ggaoZEJjRA7/0";
            path = p1;
            let num = Utils.random(0, 1);
            if (num == 0) {
            }
            else if (num == 1) {
                path = p2;
            }
            let t1 = "骑马射箭，不一样的解压方式";
            let shareTitle = t1;
            if (Laya.Browser.onMiniGame) {
                wx.shareAppMessage({
                    imageUrl: path,
                    title: shareTitle,
                    ald_desc: shareType,
                });
            }
        }
        static isShareSuccess(callBack) {
            var data1 = new Date();
            let time1 = data1.getTime();
            if (Laya.Browser.onMiniGame) {
                let isSuccess = function (res) {
                    var data2 = new Date();
                    let time2 = data2.getTime();
                    let deltaTime = (time2 - time1) / 1000;
                    let success = false;
                    if (deltaTime >= 3) {
                        success = true;
                    }
                    else {
                    }
                    wx.offShow(isSuccess);
                    callBack && callBack(success);
                };
                wx.onShow(isSuccess);
            }
            else {
                callBack && callBack(true);
            }
        }
        static wxShowNotice(callBack) {
            if (Laya.Browser.onMiniGame) {
                let data = {
                    title: '提示',
                    content: '操作失败，请尝试不同群',
                    showCancel: true,
                    confirmText: "去分享",
                    confirmColor: '#5194b9',
                    success: function (res) {
                        if (res.cancel) {
                            callBack && callBack(false);
                        }
                        else {
                            callBack && callBack(true);
                        }
                    },
                };
                wx.showModal(data);
            }
        }
        static showSystemNotice(title) {
            if (Laya.Browser.onMiniGame) {
                let noticeData = {
                    title: title,
                    icon: 'fail',
                    duration: 2000,
                };
                wx.showToast(noticeData);
            }
            else if (Laya.Browser.onQGMiniGame) {
                let noticeData = {
                    title: title,
                    icon: 'success',
                    duration: 2000,
                };
                qg.showToast(noticeData);
            }
            else if (Laya.Browser.onVVMiniGame) {
                let noticeData = {
                    title: title,
                    icon: 'success',
                    duration: 2000,
                };
                let data = {
                    message: title
                };
                qg.showToast(data);
            }
        }
        static oppoCreateTable() {
            return;
            if ((Laya.Browser.onQGMiniGame || Laya.Browser.onVVMiniGame) && qg && qg.installShortcut && qg.hasShortcutInstalled) {
                qg.hasShortcutInstalled({
                    success: function (res) {
                        if (res == false) {
                            qg.installShortcut({
                                success: function () {
                                },
                                fail: function (err) { },
                                complete: function () { }
                            });
                        }
                    },
                    fail: function (err) { },
                    complete: function () { }
                });
            }
        }
        static setRankData(data) {
            if (!Laya.Browser.onMiniGame) {
                return;
            }
            var kvDataList = [];
            var obj = {};
            obj.wxgame = {};
            obj.wxgame.value1 = data;
            obj.wxgame.update_time = Laya.Browser.now();
            kvDataList.push({ "key": "goldRank", "value": JSON.stringify(obj) });
            wx.setUserCloudStorage({
                KVDataList: kvDataList,
                success: function (e) {
                },
                fail: function (e) {
                    console.log('-----fail:' + JSON.stringify(e));
                },
                complete: function (e) {
                }
            });
        }
        static aldEventByType(eventType) {
            if (Laya.Browser.onMiniGame) {
                wx.aldSendEvent(eventType);
            }
        }
        static aldEventByTypeParam(eventType, param, str) {
            if (Laya.Browser.onMiniGame) {
                wx.aldSendEvent(eventType, { param: str });
            }
        }
    }
    Utils.GUID = 1;
    Utils.vectorUp = new Laya.Vector3(0, 1, 0);
    Utils.vectorZero = new Laya.Vector3(0, 0, 0);
    Utils.vectorOne = new Laya.Vector3(1, 1, 1);
    Utils.whileColor = new Laya.Vector4(1, 1, 1, 1);
    Utils.greenColor = new Laya.Vector4(0, 1, 0, 1);
    Utils.yellowColor = new Laya.Vector4(1, 1, 0, 1);
    var aldEventType;
    (function (aldEventType) {
        aldEventType["share_Offline"] = "\u79BB\u7EBF\u5956\u52B1\u5206\u4EAB";
        aldEventType["share_Upgrade"] = "\u7528\u6237\u5347\u7EA7\u5206\u4EAB";
        aldEventType["share_double_gold"] = "\u53CC\u500D\u91D1\u5E01\u5206\u4EAB";
        aldEventType["share_double_speed"] = "\u53CC\u500D\u901F\u5EA6\u5206\u4EAB";
        aldEventType["share_manager_upgrade"] = "\u5347\u7EA7\u7BA1\u7406\u5458\u5206\u4EAB";
        aldEventType["share_fly"] = "\u98DE\u884C\u7269\u5206\u4EAB";
        aldEventType["share_lottery"] = "\u62BD\u5956\u5206\u4EAB";
        aldEventType["ald_stage_level"] = "\u5173\u5361\u7B49\u7EA7";
        aldEventType["ald_horse_level"] = "\u9A6C\u7B49\u7EA7";
        aldEventType["ald_arrow_level"] = "\u7BAD\u7B49\u7EA7";
        aldEventType["ald_earn_level"] = "\u6536\u76CA\u7B49\u7EA7";
        aldEventType["ald_newGuide"] = "\u65B0\u624B\u5F15\u5BFC\u5B8C\u6210";
        aldEventType["ald_start_load"] = "\u5F00\u59CB\u52A0\u8F7D";
        aldEventType["ald_load_complete"] = "\u52A0\u8F7D\u5B8C\u6210";
        aldEventType["ald_load_time"] = "\u52A0\u8F7D\u65F6\u957F";
        aldEventType["ald_share"] = "\u81EA\u613F\u5206\u4EAB";
    })(aldEventType || (aldEventType = {}));

    class StageConfigData {
        constructor() {
            this.enemyIdInfos = [];
            this.missions = [];
        }
        initData(data) {
            this.id = JSON.parse(data.id);
            this.scene = data.scene;
            this.stage = data.stage;
            this.hitRate = JSON.parse(data.hitRate);
            let enemyIds = Utils.splitStrToNum(data.enemyIds, "_");
            for (let i = 0; i < enemyIds.length; i++) {
                const element = enemyIds[i];
                let info = new enemyIdInfo();
                info.index = i + 1;
                info.id = element;
                this.enemyIdInfos.push(info);
            }
            let missionTemp = Utils.splitStrToNum(data.missions, "|");
            for (let i = 0; i < missionTemp.length; i++) {
                const element = missionTemp[i];
                let temp2 = Utils.splitStrToNum(element, "_");
                if (temp2) {
                    let mission = new missionInfos();
                    mission.id = temp2[0];
                    mission.num = temp2[1];
                    this.missions.push(mission);
                }
            }
        }
    }
    class enemyIdInfo {
    }
    class missionInfos {
    }

    class EnemyConfigData {
        initData(data) {
            this.id = JSON.parse(data.id);
            this.res = data.res;
            this.enemyType = JSON.parse(data.enemyType);
            this.missionType = JSON.parse(data.missionType);
            this.isStartExit = JSON.parse(data.isStartExit) == 1;
        }
    }
    var EnemyType;
    (function (EnemyType) {
        EnemyType[EnemyType["gun"] = 1] = "gun";
        EnemyType[EnemyType["knife"] = 2] = "knife";
        EnemyType[EnemyType["gun_knife"] = 3] = "gun_knife";
        EnemyType[EnemyType["banker"] = 4] = "banker";
        EnemyType[EnemyType["exit"] = 5] = "exit";
        EnemyType[EnemyType["giveup"] = 6] = "giveup";
    })(EnemyType || (EnemyType = {}));

    class MissionConfigData {
        initData(data) {
            this.id = JSON.parse(data.id);
            this.icon = data.icon;
            this.desc = data.desc;
            this.missionType = JSON.parse(data.missionType);
        }
    }

    var CacheDataType;
    (function (CacheDataType) {
        CacheDataType["goldData"] = "goldData";
        CacheDataType["stageLevelData"] = "stageLevelData";
        CacheDataType["loginTime"] = "loginTime";
    })(CacheDataType || (CacheDataType = {}));
    class UserData {
        constructor() {
            this.stageConfigs = [];
            this.enemyConfigs = [];
            this.missionConfigs = [];
        }
        init() {
            this.mGold = 0;
            this.offlineTime = 0;
            this.mStageLevel = 1;
        }
        getCacheStorage(key) {
            var data = localStorage.getItem(key);
            return data;
        }
        setCacheStorage(key, val) {
            try {
                localStorage.setItem(key, val);
            }
            catch (error) {
            }
        }
        loadCache() {
            var goldData = this.getCacheStorage(CacheDataType.goldData);
            if (goldData != null && goldData != "") {
                this.mGold = JSON.parse(goldData);
            }
            var stageLevelData = this.getCacheStorage(CacheDataType.stageLevelData);
            if (stageLevelData != null && stageLevelData != "") {
                this.mStageLevel = JSON.parse(stageLevelData);
            }
            var loginTime = this.getCacheStorage(CacheDataType.loginTime);
            var timeDate = new Date();
            let time = timeDate.getTime();
            let day = timeDate.getDate();
            let month = timeDate.getMonth();
            if (loginTime != null && loginTime != "") {
                let loginData = JSON.parse(loginTime);
                this.offlineTime = (time - loginData.time) / 1000;
            }
            let loginData = {
                time: time,
                day: day,
                month: month,
                num: 1,
            };
            this.setCacheStorage(CacheDataType.loginTime, JSON.stringify(loginData));
        }
        addGold(num) {
            num = Math.floor(num);
            this.mGold += num;
            this.setCacheStorage(CacheDataType.goldData, this.mGold.toString());
            EventManager.instance.fire(EventType.updateGold, this.mGold);
            EventManager.instance.fire(EventType.addGold, num);
        }
        subGold(num) {
            num = Math.floor(num);
            if (this.mGold < num) {
                return;
            }
            this.mGold -= num;
            this.setCacheStorage(CacheDataType.goldData, this.mGold.toString());
            EventManager.instance.fire(EventType.updateGold, this.mGold);
        }
        nextStage() {
            this.mStageLevel++;
            console.log("下一关 ===== " + this.mStageLevel);
            this.setCacheStorage(CacheDataType.stageLevelData, this.mStageLevel.toString());
        }
        getCurStageConfig() {
            if (this.stageConfigs.length < this.mStageLevel) {
                let num = this.mStageLevel % 10;
                if (num == 0) {
                    num = 10;
                }
                let tempId = this.stageConfigs.length - 10 + num;
                if (tempId > this.stageConfigs.length) {
                    tempId = this.stageConfigs.length;
                }
                return this.stageConfigs[tempId - 1];
            }
            return this.stageConfigs[this.mStageLevel - 1];
        }
        getEnemyConfig(id) {
            return this.enemyConfigs[id - 1];
        }
        getMissionConfigById(id) {
            return this.missionConfigs[id - 1];
        }
        resetGame() {
        }
        loadStageConfig(data) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let con = new StageConfigData();
                con.initData(element);
                this.stageConfigs.push(con);
            }
        }
        loadEnemyConfig(data) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let con = new EnemyConfigData();
                con.initData(element);
                this.enemyConfigs.push(con);
            }
        }
        loadMissionConfig(data) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let con = new MissionConfigData();
                con.initData(element);
                this.missionConfigs.push(con);
            }
        }
    }

    class ScenesManager {
        init() {
        }
        openScene(sceneName, callBack, isCloseOther) {
            if (isCloseOther == null) {
                isCloseOther = true;
            }
            let args = [callBack];
            Laya.Scene.open(sceneName, isCloseOther, null, Laya.Handler.create(this, this.onOpenCompleteScene, args));
        }
        onOpenCompleteScene(callBack, scene) {
            callBack && callBack.runWith(scene);
        }
        loadScene(sceneName, callBack) {
            let args = [callBack];
            Laya.Scene.load(sceneName, Laya.Handler.create(this, this.onCompleteScene, args));
        }
        onCompleteScene(callBack, scene) {
            callBack && callBack.runWith(scene);
        }
        loadScene3D(name, callBack) {
            let args = [callBack];
            Laya.Scene3D.load(name, Laya.Handler.create(this, this.onCompleteScene3D, args));
        }
        onCompleteScene3D(callBack, scene) {
            this.scene3D = scene;
            let v = 0.2;
            console.log("scene.reflectionIntensity = " + scene.reflectionIntensity);
            Laya.stage.addChildAt(scene, 0);
            callBack && callBack.runWith(scene);
        }
    }

    class LoadManager {
        constructor() { }
        init() {
        }
        loadPrefab3D(path, callBack, self, args) {
            Laya.Sprite3D.load(path, Laya.Handler.create(self, callBack, args));
        }
        loadTexture(path, comp) {
            Laya.Texture2D.load(path, comp);
        }
        loadMaterial(path, comp) {
            Laya.BaseMaterial.load(path, comp);
        }
        load(path, callBack) {
            let loader = Laya.loader.load(path, Laya.Handler.create(this, callBack));
        }
    }

    class TimeManager {
        constructor() { }
        init() {
        }
        onceExecute(delay, self, callBack, agrs) {
            delay *= 1000;
            Laya.timer.once(delay, self, callBack, agrs);
        }
        clear(self, callBack) {
            Laya.timer.clear(self, callBack);
        }
        clearAll(self) {
            Laya.timer.clearAll(self);
        }
        loop(delay, self, callBack, args) {
            delay *= 1000;
            Laya.timer.loop(delay, self, callBack, args);
        }
        framLoop(self, callBack, args) {
            Laya.timer.frameLoop(1, self, callBack, args);
        }
        frameOnce(delay, self, callBack) {
            Laya.timer.frameOnce(delay, self, callBack);
        }
    }

    class ConstantConfig {
    }
    ConstantConfig.MainView = "MainView.scene";
    ConstantConfig.BattleView = "BattleView.scene";
    ConstantConfig.FailView = "FailView.scene";
    ConstantConfig.VictoryView = "VictoryView.scene";
    ConstantConfig.battleScenePath = "unity/Conventional/Battle.ls";
    ConstantConfig.resRootPath = "unity/Conventional/";
    ConstantConfig.startScene = "LoadingView.scene";
    ConstantConfig.SCREEN_FIT_TOP = 60;
    ConstantConfig.FLY_COIN_TIME = 180;
    ConstantConfig.texPath = "tex/";
    ConstantConfig.cardPoolSign = "cardPoolSign";
    ConstantConfig.rotateCameraX1 = -30.3;
    ConstantConfig.rotateCameraX2 = -62.4;
    ConstantConfig.gid = "5ef0b211b4f06b55fe0bf329";
    ConstantConfig.bid = "5ef0b3fcb4f06b55fe0bf32c";

    class AdManager {
        constructor() {
            this.adUnitId_BannerAd = "adunit-930f894961022d82";
            this.adUnitId_RecommendAd = "PBgAAfkSVjbG5zPQ";
            this.adUnitId_VideoAd = "adunit-446ea7b2d94863ec";
        }
        init() {
            this.initBannerAd();
        }
        initBannerAd() {
            if (Laya.Browser.onMiniGame) {
                let bannerHeight = 80;
                let bannerWidth = 300;
                let winSize = wx.getSystemInfoSync();
                this.bannerAd = wx.createBannerAd({
                    adUnitId: this.adUnitId_BannerAd,
                    adIntervals: 30,
                    style: {
                        left: (winSize.windowWidth - bannerWidth) / 2,
                        top: winSize.windowHeight - bannerHeight,
                        width: bannerWidth,
                    }
                });
                this.bannerAd.onResize(res => {
                    this.bannerAd.style.top = winSize.windowHeight - this.bannerAd.style.realHeight;
                });
                let self = this;
                this.bannerAd.onLoad(function () {
                    console.log("showBannerAd  成功");
                });
                this.bannerAd.onError(function (res) {
                    console.log("showBannerAd  失败");
                    console.log(res);
                });
            }
        }
        showGuessLike() {
        }
        initRecommendAd() {
            if (Laya.Browser.onMiniGame) {
                this.mainViewIconAd = null;
                let winSize = wx.getSystemInfoSync();
                let bannerIconHeight = 270;
                let bannerIconWidth = 75;
                if (wx.createGameIcon) {
                    this.mainViewIconAd = wx.createGameIcon({
                        adUnitId: this.adUnitId_RecommendAd,
                        count: 1,
                        style: [{
                                left: winSize.windowWidth - bannerIconWidth,
                                top: winSize.windowHeight - bannerIconHeight,
                                appNameHidden: true,
                                color: "#ffffff",
                            }]
                    });
                }
            }
        }
        initInterstitialAd() {
            if (!Laya.Browser.onMiniGame || !wx.createInterstitialAd) {
                return;
            }
            this.interstitialAd = wx.createInterstitialAd({
                adUnitId: 'adunit-95a77896c0c93647'
            });
            this.interstitialAd.onError(function (res) {
                console.log(res);
            });
        }
        initGridAd() {
            if (!Laya.Browser.onMiniGame || !wx.createGridAd) {
                return;
            }
            let bannerHeight = 80;
            let bannerWidth = 300;
            let winSize = wx.getSystemInfoSync();
            this.gridAd = wx.createGridAd({
                adUnitId: 'adunit-287fad9efd2c05d8',
                adTheme: 'white',
                gridCount: 5,
                style: {
                    left: (winSize.windowWidth - bannerWidth) / 2,
                    top: winSize.windowHeight - bannerHeight,
                    width: bannerWidth,
                }
            });
            this.gridAd.onResize(res => {
                this.gridAd.style.top = winSize.windowHeight - this.gridAd.style.realHeight;
            });
            this.gridAd.onError(function (res) {
                console.log(res);
            });
        }
        showRecommendAdIcon() {
            if (!Laya.Browser.onMiniGame || this.mainViewIconAd == null) {
                return;
            }
            if (this.mainViewIconAd) {
                this.mainViewIconAd.show();
            }
        }
        hideRecommendAdIcon() {
            if (!Laya.Browser.onMiniGame || this.mainViewIconAd == null) {
                return;
            }
            if (this.mainViewIconAd) {
                this.mainViewIconAd.hide();
            }
        }
        showInterstitialAd() {
            if (!Laya.Browser.onMiniGame || this.interstitialAd == null) {
                return;
            }
            this.interstitialAd.show().catch((err) => {
                console.log(err);
            });
        }
        showGridAd() {
            if (!Laya.Browser.onMiniGame || this.gridAd == null) {
                return;
            }
            this.gridAd.show();
        }
        hideGridAd() {
            if (!Laya.Browser.onMiniGame || this.gridAd == null) {
                return;
            }
            this.gridAd.hide();
        }
        showBannerAd() {
            if (!Laya.Browser.onMiniGame || this.bannerAd == null) {
                return;
            }
            this.bannerAd.show();
        }
        refreshBannerAd() {
            if (Laya.Browser.onMiniGame) {
                let bannerHeight = 80;
                let bannerWidth = 300;
                let winSize = wx.getSystemInfoSync();
                if (this.bannerAd) {
                    this.bannerAd.offError();
                    this.bannerAd.destroy();
                }
                this.bannerAd = wx.createBannerAd({
                    adUnitId: this.adUnitId_BannerAd,
                    adIntervals: 30,
                    style: {
                        left: (winSize.windowWidth - bannerWidth) / 2,
                        top: winSize.windowHeight - bannerHeight,
                        width: bannerWidth,
                    }
                });
                this.bannerAd.onResize(res => {
                    this.bannerAd.style.top = winSize.windowHeight - this.bannerAd.style.realHeight;
                });
                let self = this;
                this.bannerAd.onLoad(function () {
                    console.log("showBannerAd  成功");
                });
                this.bannerAd.onError(function (res) {
                    console.log("showBannerAd  失败");
                    console.log(res);
                });
            }
        }
        refreshShowBannerAd() {
            if (!Laya.Browser.onMiniGame || this.bannerAd == null) {
                return;
            }
            this.refreshBannerAd();
            this.bannerAd.show();
        }
        hideBannerAd() {
            if (!Laya.Browser.onMiniGame || this.bannerAd == null) {
                return;
            }
            this.refreshBannerAd();
        }
        showAd(callBack, index) {
            if (!Laya.Browser.onMiniGame) {
                callBack && callBack(true);
                return;
            }
            console.log("开始广告");
            let adUnitId = this.adUnitId_VideoAd;
            this.RewardedVideoAd = wx.createRewardedVideoAd({
                adUnitId: adUnitId,
            });
            this.RewardedVideoAd.onError(function (res) {
                console.log("加载广告失败" + JSON.stringify(res));
                self.showToastFail("加载广告失败");
                callBack && callBack(false);
            });
            let self = this;
            this.RewardedVideoAd.offClose();
            this.RewardedVideoAd.onClose(function (res) {
                console.log("关闭广告");
                if (res && res.isEnded || res === undefined) {
                    console.log("视频回调成功");
                    callBack && callBack(true);
                }
                else {
                    console.log("关闭视频无奖励");
                    self.showToastFail('未看完,无奖励');
                    callBack && callBack(false);
                }
            });
            self.RewardedVideoAd.show().catch(function (err) {
                self.RewardedVideoAd.load().then(function () {
                    self.RewardedVideoAd.show();
                });
            });
        }
        showToastFail(title) {
            let noticeData = {
                title: title,
                icon: 'fail',
                duration: 2000,
            };
            wx.showToast(noticeData);
        }
    }

    class Game {
        constructor() {
            console.log("game");
        }
        static get instance() {
            if (Game._instance == null) {
                Game._instance = new Game();
            }
            return Game._instance;
        }
        init() {
            this.userData = new UserData();
            this.userData.init();
            this.eventManager = EventManager.instance;
            this.eventManager.init();
            this.scenesManager = new ScenesManager();
            this.scenesManager.init();
            this.loadManager = new LoadManager();
            this.loadManager.init();
            this.timeManager = new TimeManager();
            this.timeManager.init();
            this.ad = new AdManager();
            this.ad.init();
            this.loadScene();
        }
        loadCacheData(sceneIndex) {
        }
        loadScene() {
            this.scenesManager.openScene(ConstantConfig.startScene, Laya.Handler.create(this, this.onCompleteScene), true);
            return;
            let self = this;
            if (Laya.Browser.onMiniGame) {
                const loadTask = wx.loadSubpackage({
                    name: 'unity',
                    success: function (res) {
                        self.scenesManager.openScene(ConstantConfig.BattleView, Laya.Handler.create(this, function (scene) {
                            self.setSceneUI(scene);
                        }), true);
                    },
                    fail: function (res) {
                    }
                });
            }
            else {
                self.scenesManager.openScene(ConstantConfig.BattleView, Laya.Handler.create(this, function (scene) {
                    self.setSceneUI(scene);
                }), true);
            }
        }
        loadSubpackageAsyn() {
            let self = this;
            const loadTask = wx.loadSubpackage({
                name: 'tex',
                success: function (res) {
                    self.isSubPackageLoadComplete = true;
                    self.eventManager.fire(EventType.subPackageLoadComplete);
                },
                fail: function (res) {
                }
            });
        }
        onCompleteScene(scene) {
            this.log("onCompleteScene");
            this.setSceneUI(scene);
        }
        log(str) {
            console.log(str);
        }
        setScene3D(scene) {
            this.scene3D = scene;
            let c = scene.getChildByName("CameraParent");
            this.camera = c.getChildByName("Main Camera");
            return;
            this.camera = scene.getChildByName("Main Camera");
            this.camera.enableHDR = false;
            console.log("" + Laya.stage.width);
            console.log("" + Laya.stage.height);
            let s1 = Laya.stage.height / Laya.stage.width;
            if (s1 >= 2) {
                this.camera.fieldOfView = 7;
            }
        }
        setSceneUI(scene) {
            this.sceneUI = scene;
        }
        loadSound() {
            if (Laya.Browser.onMiniGame) {
                const loadTask1 = wx.loadSubpackage({
                    name: 'sound',
                    success: function (res) {
                        Laya.SoundManager.playMusic("sound/bgm.mp3", 0);
                    },
                    fail: function (res) {
                    }
                });
            }
        }
    }

    class CameraLogic {
        constructor() {
            this.targetAngle = 0;
            this.tempAngle1 = new Laya.Vector3(0, 0, 0);
            this.tempV = new Laya.Vector3();
            this.tempV2 = new Laya.Vector3();
        }
        init() {
            this.cameraParent = Game.instance.scene3D.getChildByName("CameraParent");
            this.camera = this.cameraParent.getChildByName("Main Camera");
            this.gunRecoilStart = false;
            Game.instance.eventManager.on(EventType.ui_openAim, this, this.startAim);
            Game.instance.eventManager.on(EventType.ui_closeAim, this, this.cancelAim);
            Game.instance.eventManager.on(EventType.ui_shoot, this, this.shoot);
        }
        onLateUpdate() {
            this.doRecoil();
        }
        setCameraParentPos(pos, angle) {
            this.cameraParent.transform.position = pos;
            this.cameraParent.transform.rotationEuler = angle;
        }
        doRecoil() {
            if (!this.gunRecoilStart) {
                return;
            }
            this.tempV.x = this.targetAngle;
            this.tempV.y = this.cameraParent.transform.localRotationEuler.y;
            this.tempV.z = 0;
            Laya.Vector3.lerp(this.cameraParent.transform.localRotationEuler, this.tempV, 15 * Laya.timer.delta / 1000, this.tempV2);
            this.tempV2.z = 0;
            this.cameraParent.transform.localRotationEuler = this.tempV2;
        }
        shoot() {
            this.gunRecoilStart = true;
            let curAngle = this.cameraParent.transform.localRotationEuler.x;
            this.targetAngle = curAngle - 2;
            let self = this;
            Game.instance.timeManager.onceExecute(0.2, this, function () {
                self.gunRecoilStart = false;
                self.tempAngle1.x = self.cameraParent.transform.localRotationEuler.x;
                self.tempAngle1.y = self.cameraParent.transform.localRotationEuler.y;
                self.tempAngle1.z = 0;
                let updateCallback = function () {
                    self.tempAngle1.z = 0;
                    self.cameraParent.transform.localRotationEuler = self.tempAngle1;
                };
                Laya.Tween.to(self.tempAngle1, { x: curAngle, update: new Laya.Handler(this, updateCallback) }, 300, null);
            });
        }
        startAim() {
            Laya.Tween.clearAll(this.camera);
            Laya.Tween.to(this.camera, { fieldOfView: 17 }, 300, null);
        }
        cancelAim() {
            Laya.Tween.clearAll(this.camera);
            Laya.Tween.to(this.camera, { fieldOfView: 77 }, 300, null);
        }
        moveAim(angleX, angleY) {
            let curAngleX = this.cameraParent.transform.localRotationEuler.x;
            let curAngleY = this.cameraParent.transform.localRotationEuler.y;
            let x = curAngleX + angleY;
            let y = curAngleY + angleX;
            let speed = 3;
            let timeX = 1;
            let timeY = 1;
            this.tempV.x = x;
            this.tempV.y = y;
            this.tempV.z = 0;
            Laya.Vector3.lerp(this.cameraParent.transform.localRotationEuler, this.tempV, timeY * Laya.timer.delta / 1000, this.tempV2);
            this.cameraParent.transform.localRotationEuler = this.tempV2;
        }
    }

    class RoleBoxScript extends Laya.Script3D {
        init(callBack) {
            this.damageCallBack = callBack;
        }
        damage(num) {
            this.damageCallBack && this.damageCallBack(num);
        }
    }

    class AutoRecycle extends Laya.Script3D {
        constructor() {
            super();
        }
        onDisable() {
            Game.instance.timeManager.clearAll(this);
        }
        onDestroy() {
            Game.instance.timeManager.clearAll(this);
            this.owner = null;
        }
        init(time, recycleType) {
            this.recycleType = recycleType;
            Game.instance.timeManager.onceExecute(time, this, this.recycle);
        }
        recycle() {
            switch (this.recycleType) {
                case RecycleType.bullet:
                    PoolManager.instance.recycleBulletRes(this.owner);
                    break;
                case RecycleType.hitEffect:
                    PoolManager.instance.recycleHitEffectRes(this.owner);
                    break;
                default:
                    break;
            }
        }
    }

    class PoolManager {
        constructor() { PoolManager._instance = this; }
        static get instance() {
            return PoolManager._instance;
        }
        init() {
            this.hitEffect = Game.instance.scene3D.getChildByName("hitEffect");
            this.bullet = Game.instance.scene3D.getChildByName("bullet");
            this.hitEffect.active = false;
            this.bullet.active = false;
        }
        addAutoRecycleScr(res, time, recycleType) {
            let scr = res.getComponent(AutoRecycle);
            if (scr == null) {
                scr = res.addComponent(AutoRecycle);
            }
            scr.init(time, recycleType);
        }
        getHitEffectRes() {
            let se = Laya.Pool.getItem("hitEffectPool");
            if (se == null) {
                se = Laya.Sprite3D.instantiate(this.hitEffect);
            }
            se.active = true;
            return se;
        }
        recycleHitEffectRes(p) {
            if (!p) {
                return;
            }
            p.removeSelf();
            Laya.Pool.recover("hitEffectPool", p);
        }
        getBulletRes() {
            let se = Laya.Pool.getItem("bulletPool");
            if (se == null) {
                se = Laya.Sprite3D.instantiate(this.bullet);
            }
            return se;
        }
        recycleBulletRes(p) {
            if (!p) {
                return;
            }
            p.transform.localScale = Utils.vectorOne;
            p.removeSelf();
            Laya.Pool.recover("bulletPool", p);
        }
    }

    class BulletLogic extends Laya.Script3D {
        constructor() {
            super();
            this.moveSpeed = 150;
            this.moveSpeedZ = 30;
            this.isMove = false;
        }
        init(dir, moveDis, hitResult, damageNum) {
            this.moveDir = new Laya.Vector3();
            this.tempDir = new Laya.Vector3();
            this.tempZ = new Laya.Vector3(0, 0, 1);
            this.moveDis = moveDis;
            this.curMoveDis = 0;
            this.isMove = true;
            this.hitResult = hitResult;
            this.damageNum = damageNum;
            Laya.Vector3.normalize(dir, this.moveDir);
            let trail = this.owner.getChildByName("Trail");
        }
        onUpdate() {
            if (!this.isMove) {
                return;
            }
            this.doMove();
        }
        doMove() {
            let dis = Laya.timer.delta * this.moveSpeed / 1000;
            this.curMoveDis += dis;
            Laya.Vector3.scale(this.moveDir, dis, this.tempDir);
            this.owner.transform.translate(this.tempDir, false);
            if (this.curMoveDis >= this.moveDis) {
                this.isMove = false;
                this.shootComplete();
            }
        }
        movez() {
            if (!this.isMove) {
                return;
            }
            Laya.Vector3.scale(this.tempZ, Laya.timer.delta * this.moveSpeedZ / 1000, this.tempDir);
            this.owner.transform.translate(this.tempDir, false);
        }
        shootComplete() {
            this.owner.active = false;
            if (this.hitResult.succeeded && this.hitResult.collider.owner) {
                let eff = PoolManager.instance.getHitEffectRes();
                this.hitResult.collider.owner.addChild(eff);
                eff.transform.position = this.owner.transform.position;
                eff.transform.setWorldLossyScale(Utils.vectorOne);
                PoolManager.instance.addAutoRecycleScr(eff, 0.5, RecycleType.hitEffect);
                eff.active = true;
                let c = 1;
                if (this.hitResult.collider.owner.name == "headHit") {
                    c = 2;
                }
                let scr = this.hitResult.collider.owner.getComponent(RoleBoxScript);
                if (scr) {
                    scr.damage(this.damageNum * c);
                }
            }
        }
        clearData() {
            if (this.owner) {
                PoolManager.instance.recycleBulletRes(this.owner);
            }
            this.destroy();
            this.owner = null;
        }
    }

    class HeroManager {
        constructor() {
            this.blood = 100;
            this.bloodBase = 100;
            this.rayHitResult = new Laya.HitResult();
            this.aimRay = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
            this.tempDir = new Laya.Vector3();
            this.tempDir1 = new Laya.Vector3();
            this.tempDir2 = new Laya.Vector3();
            this.tempMousePos = new Laya.Vector2();
            this.tempPos = new Laya.Vector3();
        }
        init() {
            this.heroObj = Game.instance.scene3D.getChildByName("hero");
            this.heroObj.active = false;
            Game.instance.eventManager.on(EventType.stage_loadComplete, this, this.stageLoadComplete);
            this.blood = this.bloodBase;
        }
        resetGame() {
            this.blood = this.bloodBase;
        }
        damage(num) {
            if (this.blood <= 0) {
                return;
            }
            this.blood -= num;
            Game.instance.eventManager.fire(EventType.hero_bloodUpdate);
            if (this.blood <= 0) {
                BattleManager.instance.gameOver(GameOverType.shooted);
            }
        }
        stageLoadComplete() {
            let stageRes = BattleManager.instance.stageManager.stageRes;
            let heroSpots = stageRes.getChildByName("HeroSpots");
            this.heroObj.transform.position = heroSpots.transform.position;
            this.heroObj.active = true;
            this.heroObj.transform.rotationEuler = heroSpots.transform.rotationEuler;
            BattleManager.instance.cameraLogic.setCameraParentPos(this.heroObj.transform.position, this.heroObj.transform.rotationEuler);
            this.resetGame();
        }
        getHeroPos() {
            return this.heroObj.transform.position;
        }
        shoot() {
            let x = Laya.stage.width * 0.5;
            let y = Laya.stage.height * 0.5;
            if (Laya.Browser.onQGMiniGame || Laya.Browser.onQQMiniGame || Laya.Browser.onVVMiniGame) {
                x = Laya.Browser.width * 0.5;
                y = Laya.Browser.height * 0.5;
            }
            let cameraPos = BattleManager.instance.cameraLogic.camera.transform.position;
            let bullet = Laya.Sprite3D.instantiate(BattleManager.instance.bullet);
            Game.instance.scene3D.addChild(bullet);
            bullet.transform.position = cameraPos;
            bullet.active = true;
            this.tempMousePos.x = x;
            this.tempMousePos.y = y;
            BattleManager.instance.cameraLogic.camera.viewportPointToRay(this.tempMousePos, this.aimRay);
            Game.instance.scene3D.physicsSimulation.rayCast(this.aimRay, this.rayHitResult, 100);
            let moveDis = 100;
            if (this.rayHitResult.succeeded) {
                Laya.Vector3.subtract(this.rayHitResult.point, bullet.transform.position, this.tempDir);
                moveDis = Laya.Vector3.scalarLength(this.tempDir);
            }
            else {
                Laya.Vector3.scale(this.aimRay.direction, 100, this.tempDir1);
                Laya.Vector3.subtract(cameraPos, bullet.transform.position, this.tempDir2);
                Laya.Vector3.add(this.tempDir1, this.tempDir2, this.tempDir);
            }
            let p = this.tempDir;
            this.tempDir1.x = -p.x + bullet.transform.position.x;
            this.tempDir1.y = -p.y + bullet.transform.position.y;
            this.tempDir1.z = -p.z + bullet.transform.position.z;
            bullet.transform.lookAt(this.tempDir1, Utils.vectorUp, false);
            let scr = bullet.addComponent(BulletLogic);
            scr.init(this.tempDir, moveDis, this.rayHitResult, 70);
        }
        getAttackHeroPos(isDamgeShoot) {
            let pos = this.heroObj.transform.position;
            let w = 2;
            let h = 1.1;
            let heroBodyW = 0.4;
            let heroBodyH = 1.1;
            let randW = w;
            let randH = h;
            if (isDamgeShoot) {
                w = 0.2;
                h = 0.3;
                randW = Utils.random(0, w * 100) / 100 - w / 2;
                randH = Utils.random(0, h * 100) / 100 + 0.5;
            }
            else {
                randW = Utils.random(0, w * 100) / 100 - w / 2;
                if (randW <= heroBodyW / 2 && randW >= -heroBodyW / 2) {
                    randH = 0.3 + h;
                    randW = w;
                }
                else {
                    randH = Utils.random(0, h * 100) / 100 + 0.5;
                }
            }
            this.tempPos.x = pos.x + randW;
            this.tempPos.y = pos.y + randH;
            this.tempPos.z = pos.z;
            return this.tempPos;
        }
    }

    class StageManager {
        constructor() {
            this.isHadTriggerFight = false;
        }
        init() {
            this.curStageConfig = Game.instance.userData.getCurStageConfig();
            this.isHadTriggerFight = false;
            this.loadScene();
            Game.instance.eventManager.on(EventType.reset_Game, this, this.resetGame);
        }
        resetGame() {
            this.curStageConfig = Game.instance.userData.getCurStageConfig();
            this.isHadTriggerFight = false;
            this.stageRes.removeSelf();
            this.stageRes.destroy();
            this.stageRes = null;
            this.loadStage();
        }
        loadScene() {
            let path = this.getPrefabPath(this.curStageConfig.scene);
            Game.instance.loadManager.loadPrefab3D(path, function (prefab) {
                this.sceneRes = prefab;
                Game.instance.scene3D.addChild(prefab);
                this.loadStage();
                Laya.Resource.destroyUnusedResources();
            }, this);
        }
        loadStage() {
            let path = this.getPrefabPath(this.curStageConfig.stage);
            console.log(path);
            Game.instance.loadManager.loadPrefab3D(path, function (prefab) {
                this.stageRes = prefab;
                Game.instance.scene3D.addChild(prefab);
                Laya.Resource.destroyUnusedResources();
                Game.instance.eventManager.fire(EventType.stage_loadComplete);
                this.setTrigger();
            }, this);
        }
        getPrefabPath(prefabPath) {
            let path = ConstantConfig.resRootPath + prefabPath + ".lh";
            return path;
        }
        setTrigger() {
            this.isHadTriggerFight = false;
            let triggers = this.stageRes.getChildByName("Triggers");
            let self = this;
            let callBack = function (num) {
                self.triggerFight();
            };
            for (let i = 0; i < triggers.numChildren; i++) {
                let child = triggers.getChildAt(i);
                let scr = child.addComponent(RoleBoxScript);
                scr.init(callBack);
            }
        }
        triggerFight() {
            if (this.isHadTriggerFight) {
                return;
            }
            this.isHadTriggerFight = true;
            Game.instance.eventManager.fire(EventType.stage_triggerFight);
        }
        checkIsShootDamage() {
            let rand = Utils.random(1, 100);
            if (rand <= this.curStageConfig.hitRate) {
                return true;
            }
            return false;
        }
    }

    class EnemyBulletBase extends Laya.Script3D {
        constructor() {
            super();
            this.moveSpeed = 100;
            this.isMove = false;
            this.isDamage = false;
        }
        init(dir, moveDis, isDamage) {
            this.moveDir = new Laya.Vector3();
            this.tempDir = new Laya.Vector3();
            this.tempZ = new Laya.Vector3(0, 0, 1);
            this.moveDis = moveDis;
            this.curMoveDis = 0;
            this.isMove = true;
            this.isDamage = isDamage;
            this.moveSpeed = 100;
            Laya.Vector3.normalize(dir, this.moveDir);
        }
        onDisable() {
        }
        onUpdate() {
            if (!this.isMove) {
                return;
            }
            this.doMove();
        }
        doMove() {
            let dis = Laya.timer.delta * this.moveSpeed / 1000;
            this.curMoveDis += dis;
            Laya.Vector3.scale(this.moveDir, dis, this.tempDir);
            this.owner.transform.translate(this.tempDir, false);
            if (this.curMoveDis >= this.moveDis) {
                this.isMove = false;
                this.shootComplete();
            }
        }
        shootComplete() {
        }
        clearData() {
            if (this.owner) {
                this.owner.active = false;
                PoolManager.instance.recycleBulletRes(this.owner);
            }
            this.isMove = false;
            this.destroy();
            this.owner = null;
        }
    }

    class EnemyBulletLogic extends EnemyBulletBase {
        constructor() { super(); }
        init(dir, moveDis, isDamage) {
            super.init(dir, moveDis, isDamage);
            let trail = this.owner.getChildByName("Trail");
            if (trail) {
                trail.active = true;
            }
        }
        shootComplete() {
            let eff = PoolManager.instance.getHitEffectRes();
            let pos = BattleManager.instance.heroManager.getHeroPos();
            Game.instance.scene3D.addChild(eff);
            eff.transform.position = this.owner.transform.position;
            PoolManager.instance.addAutoRecycleScr(eff, 0.5, RecycleType.hitEffect);
            eff.active = true;
            let mesh = this.owner.getChildByName("mesh");
            if (mesh) {
                mesh.active = false;
            }
            let self = this;
            let callback = function () {
                if (mesh) {
                    mesh.active = true;
                }
                self.clearData();
            };
            Game.instance.timeManager.onceExecute(0.5, this, callback);
            if (this.isDamage) {
                BattleManager.instance.heroManager.damage(23);
            }
        }
    }

    class EnemyBase {
        constructor() {
            this.blood = 100;
            this.shootMovePath = [];
        }
        init(enemyCfg, spots) {
            this.enemyCfg = enemyCfg;
            this.spotsParent = spots;
            this.isDead = false;
            this.blood = 100;
            this.shootMovePath = [];
            Game.instance.eventManager.on(EventType.stage_triggerFight, this, this.triggerFight);
            this.loadEnemy();
        }
        clearData() {
            Game.instance.timeManager.clearAll(this);
            Game.instance.eventManager.off(EventType.stage_triggerFight, this, this.triggerFight);
            if (this.headRoleBoxScript) {
                this.headRoleBoxScript.destroy();
            }
            if (this.bodyRoleBoxScript) {
                this.bodyRoleBoxScript.destroy();
            }
            if (this.owner) {
                this.owner.removeSelf();
                this.owner.destroy();
            }
            this.spotsParent = null;
            this.owner = null;
            this.animCtrl = null;
            this.headObj = null;
            this.bodyObj = null;
            this.headRoleBoxScript = null;
            this.bodyRoleBoxScript = null;
        }
        loadEnemy() {
            let path = this.getPrefabPath(this.enemyCfg.res);
            console.log(path);
            Game.instance.loadManager.loadPrefab3D(path, function (prefab) {
                prefab = Laya.Sprite3D.instantiate(prefab);
                Game.instance.scene3D.addChild(prefab);
                this.loadComplete(prefab);
            }, this);
        }
        getPrefabPath(prefabPath) {
            let path = ConstantConfig.resRootPath + prefabPath + ".lh";
            return path;
        }
        loadComplete(prefab) {
            this.owner = prefab;
            let enemySpots1 = this.spotsParent.getChildByName("enemySpots1");
            this.owner.transform.position = enemySpots1.transform.position;
            this.owner.transform.rotationEuler = enemySpots1.transform.rotationEuler;
            this.owner.active = true;
            this.headObj = Utils.findChildByName(this.owner, "headHit");
            this.bodyObj = this.owner.getChildByName("bodyHit");
            let enemyRoot = this.owner.getChildByName("root");
            this.animCtrl = enemyRoot.getComponent(Laya.Animator);
            this.setBoxScript();
            this.setShootSpots();
            this.showWeapon();
        }
        showWeapon() {
            switch (this.enemyCfg.enemyType) {
                case EnemyType.gun:
                    let gun = Utils.findChildByName(this.owner, "GunRoot");
                    if (gun)
                        gun.active = true;
                    let knifeLeft = Utils.findChildByName(this.owner, "KnifeLeft");
                    if (knifeLeft)
                        knifeLeft.active = false;
                    break;
                case EnemyType.knife:
                    let gun2 = Utils.findChildByName(this.owner, "GunRoot");
                    if (gun2)
                        gun2.active = false;
                    let knifeLeft2 = Utils.findChildByName(this.owner, "KnifeLeft");
                    if (knifeLeft2)
                        knifeLeft2.active = true;
                    break;
                default:
                    break;
            }
        }
        setShootSpots() {
            let shootSpots = this.spotsParent.getChildByName("shootSpots");
            if (!shootSpots) {
                return;
            }
            for (let i = 0; i < shootSpots.numChildren; i++) {
                let child = shootSpots.getChildAt(i);
                this.shootMovePath.push(child.transform.position);
            }
        }
        setBoxScript() {
            let self = this;
            let callBack = function (num) {
                self.damage(num);
            };
            if (this.headObj) {
                this.headRoleBoxScript = this.headObj.addComponent(RoleBoxScript);
                this.headRoleBoxScript.init(callBack);
            }
            if (this.bodyObj) {
                this.bodyRoleBoxScript = this.bodyObj.addComponent(RoleBoxScript);
                this.bodyRoleBoxScript.init(callBack);
            }
        }
        damage(num) {
            if (BattleManager.instance.isGameOver) {
                return;
            }
            if (this.isDead || this.owner == null) {
                return;
            }
            BattleManager.instance.stageManager.triggerFight();
            this.blood -= num;
            if (this.blood <= 0) {
                this.dead();
            }
        }
        dead() {
            this.isDead = true;
            this.animCtrl.crossFade("Dead", 0.1, 0, 0);
        }
        triggerFight() {
        }
    }

    class EnemyMoveBase extends EnemyBase {
        constructor() {
            super(...arguments);
            this.isMoveComplete = false;
            this.movePath = [];
            this.curMoveIndex = 0;
            this.moveSpeed = 1.5;
            this.runSpeed = 1.5;
            this.walkSpeed = 0.5;
            this.moveTempV = new Laya.Vector3();
            this.moveTempAngle = new Laya.Vector3();
        }
        init(enemyCfg, spots) {
            super.init(enemyCfg, spots);
            this.movePath = [];
            this.isStartMove = false;
            this.isMoveComplete = false;
        }
        triggerFight() {
            if (this.isDead) {
                return;
            }
            for (let i = 0; i < this.shootMovePath.length; i++) {
                const element = this.shootMovePath[i];
                this.movePath.push(element);
            }
            this.curMoveIndex = 0;
            this.changeToRun();
        }
        changeToRun() {
            this.isStartMove = true;
            this.animCtrl.play("Run");
            this.moveSpeed = this.runSpeed;
            Laya.Tween.clearAll(this.moveTempV);
            this.move();
        }
        move() {
            if (!this.isStartMove || this.movePath.length <= this.curMoveIndex) {
                return;
            }
            let targetPos = this.movePath[this.curMoveIndex];
            let curPos = this.owner.transform.position;
            let dis = Laya.Vector3.distance(targetPos, curPos);
            let time = 1000 * dis / this.moveSpeed;
            this.moveTempV = curPos;
            let self = this;
            let updateCallback = function () {
                this.owner.transform.position = this.moveTempV;
            };
            Laya.Tween.to(this.moveTempV, { x: targetPos.x, y: targetPos.y, z: targetPos.z, update: new Laya.Handler(this, updateCallback) }, time, null, Laya.Handler.create(this, function () {
                this.curMoveIndex++;
                if (this.movePath.length <= this.curMoveIndex) {
                    this.moveComplete();
                }
                else {
                    this.move();
                }
            }));
            this.doRotateToPos(targetPos);
        }
        doRotateToPos(targetPos) {
            let curPos = this.owner.transform.position;
            let angle = Laya.MathUtil.getRotation(curPos.x, curPos.z, targetPos.x, targetPos.z);
            let tartAngle = 90 - angle;
            this.moveTempAngle = this.owner.transform.localRotationEuler;
            let y = this.owner.transform.localRotationEuler.y;
            let detaAngle = tartAngle - y;
            if (Math.abs(detaAngle) >= 180) {
                detaAngle = Utils.changeAngleTo360(detaAngle);
                if (detaAngle >= 180) {
                    detaAngle -= 360;
                }
            }
            tartAngle = detaAngle + y;
            let rotateCallback = function () {
                this.owner.transform.localRotationEuler = this.moveTempAngle;
            };
            Laya.Tween.to(this.moveTempAngle, { y: tartAngle, update: new Laya.Handler(this, rotateCallback) }, 300, null);
        }
        moveComplete() {
            this.isMoveComplete = true;
            this.isStartMove = false;
        }
        dead() {
            Laya.Tween.clearAll(this.moveTempAngle);
            Laya.Tween.clearAll(this.moveTempV);
            Game.instance.timeManager.clearAll(this);
            super.dead();
            Game.instance.eventManager.fire(EventType.stage_enemyDead, this);
        }
        clearData() {
            Laya.Tween.clearAll(this.moveTempAngle);
            Laya.Tween.clearAll(this.moveTempV);
            super.clearData();
        }
    }

    class EnemyGun extends EnemyMoveBase {
        constructor() {
            super(...arguments);
            this.isStartShoot = false;
            this.shootInterval = 1000;
            this.curShootTime = 0;
            this.tempDir = new Laya.Vector3();
            this.tempDir1 = new Laya.Vector3();
        }
        init(enemyCfg, spots) {
            super.init(enemyCfg, spots);
            this.isStartShoot = false;
            Game.instance.timeManager.framLoop(this, this.update);
            this.shootInterval = Utils.random(3000, 5000);
        }
        loadComplete(prefab) {
            super.loadComplete(prefab);
            this.gunRoot = Utils.findChildByName(this.owner, "GunRoot");
        }
        update() {
            if (this.isDead) {
                return;
            }
            this.checkShoot();
        }
        changeToShoot() {
            this.isStartShoot = true;
            this.animCtrl.play("Shoot");
            this.doRotateToPos(BattleManager.instance.heroManager.getHeroPos());
        }
        moveComplete() {
            super.moveComplete();
            this.changeToShoot();
        }
        triggerFight() {
            if (this.isDead) {
                return;
            }
            if (this.shootMovePath.length <= 0) {
                this.changeToShoot();
                return;
            }
            super.triggerFight();
        }
        checkShoot() {
            if (!this.isStartShoot) {
                return;
            }
            this.curShootTime += Laya.timer.delta;
            if (this.curShootTime >= this.shootInterval) {
                this.curShootTime = 0;
                this.doShoot();
            }
        }
        doShoot() {
            if (this.isDead) {
                return;
            }
            let bullet = PoolManager.instance.getBulletRes();
            Game.instance.scene3D.addChild(bullet);
            bullet.transform.position = this.gunRoot.transform.position;
            bullet.active = true;
            let isDamgeShoot = BattleManager.instance.stageManager.checkIsShootDamage();
            this.tempDir1 = BattleManager.instance.heroManager.getAttackHeroPos(isDamgeShoot);
            Laya.Vector3.subtract(this.tempDir1, bullet.transform.position, this.tempDir);
            let moveDis = Laya.Vector3.scalarLength(this.tempDir);
            let p = this.tempDir;
            this.tempDir1.x = -p.x + bullet.transform.position.x;
            this.tempDir1.y = -p.y + bullet.transform.position.y;
            this.tempDir1.z = -p.z + bullet.transform.position.z;
            bullet.transform.lookAt(this.tempDir1, Utils.vectorUp, false);
            let scr = bullet.addComponent(EnemyBulletLogic);
            scr.init(this.tempDir, moveDis, isDamgeShoot);
        }
    }

    class EnemyHostage extends EnemyMoveBase {
        init(enemyCfg, spots) {
            super.init(enemyCfg, spots);
            this.blood = 1;
        }
        loadComplete(prefab) {
            super.loadComplete(prefab);
            if (this.enemyCfg.enemyType == EnemyType.giveup) {
                this.animCtrl.play("GiveUp");
            }
        }
        triggerFight() {
            if (this.shootMovePath.length <= 0) {
                return;
            }
            super.triggerFight();
        }
        moveComplete() {
            super.moveComplete();
            this.animCtrl.play("Idle");
            this.doRotateToPos(BattleManager.instance.heroManager.getHeroPos());
        }
    }

    class EnemyNoGun extends EnemyMoveBase {
        init(enemyCfg, spots) {
            super.init(enemyCfg, spots);
            Game.instance.eventManager.on(EventType.startGame, this, this.startGame);
        }
        startGame() {
            if (this.enemyCfg.isStartExit) {
                this.startEscape();
            }
        }
        startEscape() {
            if (this.isDead) {
                return;
            }
            if (this.shootMovePath.length <= 0) {
                return;
            }
            for (let i = 0; i < this.shootMovePath.length; i++) {
                const element = this.shootMovePath[i];
                this.movePath.push(element);
            }
            this.curMoveIndex = 0;
            this.isStartMove = true;
            this.animCtrl.play("Walk");
            this.moveSpeed = this.walkSpeed;
            this.move();
        }
        triggerFight() {
            if (this.shootMovePath.length <= 0) {
                return;
            }
            if (this.isStartMove) {
                this.changeToRun();
                return;
            }
            super.triggerFight();
        }
        moveComplete() {
            super.moveComplete();
            this.animCtrl.play("Idle");
            Game.instance.timeManager.onceExecute(0.6, this, function () {
                console.log("任务失败，目标逃跑了");
                BattleManager.instance.gameOver(GameOverType.enemy_escape);
            });
        }
        clearData() {
            Game.instance.eventManager.off(EventType.startGame, this, this.startGame);
            super.clearData();
        }
    }

    class EnemyManager {
        constructor() {
            this.enemys = [];
            this.hostages = [];
        }
        init() {
            Game.instance.eventManager.on(EventType.stage_loadComplete, this, this.stageLoadComplete);
            Game.instance.eventManager.on(EventType.stage_enemyDead, this, this.deadEnemy);
            Game.instance.eventManager.on(EventType.reset_Game, this, this.resetGame);
        }
        stageLoadComplete() {
            this.curStageConfig = Game.instance.userData.getCurStageConfig();
            let enemyIdInfos = this.curStageConfig.enemyIdInfos;
            for (let i = 0; i < enemyIdInfos.length; i++) {
                const element = enemyIdInfos[i];
                this.loadEnemy(element);
            }
        }
        loadEnemy(enemyIdInfo) {
            let stageRes = BattleManager.instance.stageManager.stageRes;
            let temp = "enemy" + enemyIdInfo.index;
            let enemySpotsInfo = stageRes.getChildByName(temp);
            if (!enemySpotsInfo) {
                console.log("表里面的敌人数量 和  预制里面敌人数量不一致   index === " + enemyIdInfo.index);
                return;
            }
            let enemyCfg = Game.instance.userData.getEnemyConfig(enemyIdInfo.id);
            let enemy = null;
            switch (enemyCfg.enemyType) {
                case EnemyType.gun:
                    enemy = new EnemyGun();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.enemys.push(enemy);
                    break;
                case EnemyType.gun_knife:
                    enemy = new EnemyGun();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.enemys.push(enemy);
                    break;
                case EnemyType.knife:
                    enemy = new EnemyNoGun();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.enemys.push(enemy);
                    break;
                case EnemyType.banker:
                    enemy = new EnemyHostage();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.hostages.push(enemy);
                    break;
                case EnemyType.exit:
                    enemy = new EnemyNoGun();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.enemys.push(enemy);
                    break;
                case EnemyType.giveup:
                    enemy = new EnemyHostage();
                    enemy.init(enemyCfg, enemySpotsInfo);
                    this.hostages.push(enemy);
                    break;
                default:
                    break;
            }
        }
        deadEnemy(enemy) {
            if (enemy.enemyCfg.enemyType == EnemyType.banker) {
                console.log("失败了   人质被打了");
                BattleManager.instance.gameOver(GameOverType.hostage_shooted);
            }
        }
        resetGame() {
            for (let i = 0; i < this.enemys.length; i++) {
                const element = this.enemys[i];
                element.clearData();
            }
            this.enemys = [];
            for (let i = 0; i < this.hostages.length; i++) {
                const element = this.hostages[i];
                element.clearData();
            }
            this.hostages = [];
        }
    }

    class MissionLogic {
        init(cfg, missionNum) {
            this.missionCfg = cfg;
            this.missionState = MissionState.start;
            this.progressNum = 0;
            this.missionNum = missionNum;
        }
        updateProgress() {
            if (this.missionState == MissionState.complete) {
                return;
            }
            this.progressNum++;
            if (this.progressNum >= this.missionNum) {
                this.completeMission();
            }
        }
        completeMission() {
            this.missionState = MissionState.complete;
        }
    }
    var MissionState;
    (function (MissionState) {
        MissionState[MissionState["start"] = 1] = "start";
        MissionState[MissionState["complete"] = 2] = "complete";
    })(MissionState || (MissionState = {}));

    class MissionManager {
        constructor() {
            this.allMissionInfos = [];
        }
        init() {
            this.createMission();
            Game.instance.eventManager.on(EventType.stage_enemyDead, this, this.deadEnemy);
            Game.instance.eventManager.on(EventType.reset_Game, this, this.resetGame);
        }
        resetGame() {
            this.allMissionInfos = [];
            this.createMission();
        }
        createMission() {
            let stageCfg = Game.instance.userData.getCurStageConfig();
            let missions = stageCfg.missions;
            for (let i = 0; i < missions.length; i++) {
                const element = missions[i];
                let missionCfg = Game.instance.userData.getMissionConfigById(element.id);
                let mission = new MissionLogic();
                mission.init(missionCfg, element.num);
                this.allMissionInfos.push(mission);
            }
        }
        deadEnemy(enemy) {
            for (let i = 0; i < this.allMissionInfos.length; i++) {
                const element = this.allMissionInfos[i];
                if (enemy.enemyCfg.missionType == element.missionCfg.missionType) {
                    element.updateProgress();
                }
            }
            this.checkMission();
        }
        checkMission() {
            for (let i = 0; i < this.allMissionInfos.length; i++) {
                const element = this.allMissionInfos[i];
                if (element.missionState !== MissionState.complete) {
                    return;
                }
            }
            console.log("所有任务完成  游戏 胜利");
            BattleManager.instance.gameOver(GameOverType.Win);
        }
    }

    class BattleManager extends Laya.Script3D {
        constructor() {
            super();
            this.isGameOver = false;
            BattleManager._instance = this;
            this.init();
        }
        static get instance() {
            return BattleManager._instance;
        }
        onAwake() {
        }
        onLateUpdate() {
            if (this.cameraLogic) {
                this.cameraLogic.onLateUpdate();
            }
        }
        init() {
            this.bullet = Game.instance.scene3D.getChildByName("bullet");
            this.cameraLogic = new CameraLogic();
            this.cameraLogic.init();
            this.heroManager = new HeroManager();
            this.heroManager.init();
            this.enemyManager = new EnemyManager();
            this.enemyManager.init();
            this.stageManager = new StageManager();
            this.stageManager.init();
            this.missionManager = new MissionManager();
            this.missionManager.init();
            this.poolManager = new PoolManager();
            this.poolManager.init();
            Game.instance.eventManager.on(EventType.startGame, this, this.startGame);
        }
        gameOver(gameOverType) {
            if (this.isGameOver) {
                return;
            }
            this.isGameOver = true;
            Game.instance.eventManager.fire(EventType.gameOver, gameOverType);
        }
        startGame() {
            this.isGameOver = false;
        }
    }

    class BattleView extends ui.BattleViewUI {
        constructor() {
            super();
            this.aimBtnPos = new Laya.Vector2();
            this.isCanFire = false;
            this.totalBulletCount = 4;
            this.curBulletCount = 4;
            this.isReloadingBullet = false;
            this.totalReloadTime = 2000;
            this.curReloadTime = 0;
            this.isMoveAimDown = false;
            this.delayCloseAim = null;
            this.doCloseAnimCallback = null;
            this.isStartGame = false;
            this.doShowAimBtn = null;
            this.touchPos = new Laya.Vector2();
            this.startTouchPos = new Laya.Vector2();
            this.point = new Laya.Point();
        }
        onAwake() {
        }
        onEnable() {
            this.init();
        }
        onDisable() {
            Game.instance.eventManager.off(EventType.gameOver, this, this.gameOver);
        }
        init() {
            this.initObj();
            this.initMask();
            this.aimBox.alpha = 0;
            this.moveAimBg.visible = false;
            this.isMoveAimDown = false;
            this.aimBtnPos.x = this.aimBtn.x;
            this.aimBtnPos.y = this.aimBtn.y;
            this.isCanFire = false;
            this.totalBulletCount = 4;
            this.curBulletCount = this.totalBulletCount;
            this.isReloadingBullet = false;
            this.reloadSprite = new Laya.Sprite();
            this.reloadBox.addChild(this.reloadSprite);
            this.isStartGame = false;
            this.battleInfoBox.visible = false;
            Game.instance.timeManager.framLoop(this, this.reloadBullet);
            this.reloadComplete();
            this.hideCancelAimBtn();
            this.showMissionList();
            let self = this;
            this.delayCloseAim = function () {
                self.closeAim();
            };
            this.doCloseAnimCallback = function () {
                self.aimBox.alpha = 0;
                self.smallAimBox.visible = true;
            };
            this.doShowAimBtn = function () {
                self.aimBtn.alpha = 0.7;
            };
            Game.instance.eventManager.on(EventType.gameOver, this, this.gameOver);
            Game.instance.eventManager.on(EventType.hero_bloodUpdate, this, this.showBloodInfo);
        }
        initObj() {
            this.aimBtn.on(Laya.Event.MOUSE_DOWN, this, this.onAimBtnDown);
            this.aimBtn.on(Laya.Event.MOUSE_UP, this, this.onAimBtnUp);
            this.aimBtn.on(Laya.Event.MOUSE_MOVE, this, this.onAimBtnMove);
            this.aimBox.on(Laya.Event.MOUSE_DOWN, this, this.onBgBtnDown);
            this.aimBox.on(Laya.Event.MOUSE_MOVE, this, this.onBgBtnMove);
            this.aimBox.on(Laya.Event.MOUSE_UP, this, this.onBgBtnUp);
            this.cancleAimBtn.on(Laya.Event.CLICK, this, this.onCancelBtnClick);
        }
        initMask() {
            var maskArea = new Laya.Sprite();
            maskArea.alpha = 0.5;
            maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            this.maskContain.addChild(maskArea);
            let interactionArea = new Laya.Sprite();
            interactionArea.blendMode = "destination-out";
            this.maskContain.addChild(interactionArea);
            let x = this.maskBox.x;
            let y = this.maskBox.y;
            interactionArea.graphics.drawCircle(x, y, 285, "#000000");
        }
        startGame() {
            this.isStartGame = true;
            this.missionBox.visible = false;
            this.battleInfoBox.visible = true;
            this.showBloodInfo();
            this.showBattleMissionList();
            Game.instance.eventManager.fire(EventType.startGame);
        }
        showBloodInfo() {
            let p = BattleManager.instance.heroManager.blood / BattleManager.instance.heroManager.bloodBase;
            this.bloodBar.value = p;
        }
        showBattleMissionList() {
            var data = [];
            let missions = BattleManager.instance.missionManager.allMissionInfos;
            for (let i = 0; i < missions.length; i++) {
                const element = missions[i];
                data.push({
                    icon: { skin: "UI/" + element.missionCfg.icon + ".png" },
                });
            }
            this.missionIconList.array = data;
            this.missionIconList.repeatY = missions.length;
        }
        showMissionList() {
            this.missionTitle.text = "任 务 " + Game.instance.userData.mStageLevel;
            var data = [];
            let stageCfg = Game.instance.userData.getCurStageConfig();
            let missions = stageCfg.missions;
            for (let i = 0; i < missions.length; i++) {
                const element = missions[i];
                let missionCfg = Game.instance.userData.getMissionConfigById(element.id);
                let isShowCountInfo = true;
                if (element.num == 1) {
                    isShowCountInfo = false;
                }
                data.push({
                    icon: { skin: "UI/" + missionCfg.icon + ".png" },
                    desc: { text: missionCfg.desc },
                    countBg: { visible: isShowCountInfo },
                    countLabel: { visible: isShowCountInfo, text: "x" + element.num }
                });
            }
            this.missionList.repeatY = missions.length;
            this.missionList.array = data;
            let h = 256 + (missions.length - 1) * 138;
            this.missionBg.height = h;
        }
        gameOver(gameOverType) {
            if (gameOverType == GameOverType.Win) {
                Game.instance.timeManager.onceExecute(1.5, this, function () {
                    Game.instance.scenesManager.openScene(ConstantConfig.VictoryView, Laya.Handler.create(this, function (scene) {
                    }));
                });
            }
            else {
                Game.instance.scenesManager.openScene(ConstantConfig.FailView, Laya.Handler.create(this, function (scene) {
                    scene.init(gameOverType);
                }));
            }
        }
        showBulletInfo() {
            var data = [];
            for (let i = 0; i < this.totalBulletCount; i++) {
                if (i >= this.curBulletCount) {
                    data.push({ bulletIcon: { alpha: 0.3 } });
                }
                else {
                    data.push({ bulletIcon: { alpha: 1 } });
                }
            }
            this.bulletList.array = data;
        }
        startReload() {
            this.isReloadingBullet = true;
            this.curReloadTime = 0;
            this.reloadSprite.graphics.clear();
            this.reloadBox.visible = true;
        }
        reloadComplete() {
            this.isReloadingBullet = false;
            this.curBulletCount = this.totalBulletCount;
            this.showBulletInfo();
            this.reloadBox.visible = false;
        }
        reloadBullet() {
            if (!this.isReloadingBullet) {
                return;
            }
            this.curReloadTime += Laya.timer.delta;
            let progressNum = this.curReloadTime / this.totalReloadTime;
            progressNum = Math.min(1, progressNum);
            let angle = 360 * progressNum;
            this.reloadSprite.graphics.clear();
            this.reloadSprite.graphics.drawPie(this.reloadPos.x, this.reloadPos.y, 40, -90, -90 + angle, "#ffffff");
            if (this.curReloadTime >= this.totalReloadTime) {
                this.reloadComplete();
            }
        }
        showCancelAimBtn() {
            Laya.Tween.to(this.cancleAimBtn, { x: 0 }, 300, null, Laya.Handler.create(this, function () {
            }));
        }
        hideCancelAimBtn() {
            this.cancleAimBtn.x = -150;
        }
        closeAim() {
            Game.instance.timeManager.onceExecute(0.3, this, this.doCloseAnimCallback);
            this.hideCancelAimBtn();
            Game.instance.eventManager.fire(EventType.ui_closeAim);
        }
        openAnim() {
            Game.instance.timeManager.clear(this, this.doCloseAnimCallback);
            Game.instance.timeManager.clear(this, this.doShowAimBtn);
            this.smallAimBox.visible = false;
            this.aimBtn.alpha = 0;
            let time = (1 - this.aimBox.alpha) * 300;
            Laya.Tween.to(this.aimBox, { alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                this.isCanFire = true;
            }));
            Game.instance.eventManager.fire(EventType.ui_openAim);
        }
        onCancelBtnClick() {
            this.moveAimBg.visible = true;
            this.aimBtn.alpha = 0;
            this.isCanFire = false;
            this.closeAim();
        }
        onBgBtnDown(e) {
            if (this.isStartGame == false) {
                this.startGame();
            }
            this.moveAimBg.visible = true;
            this.aimBtn.visible = false;
            this.touchPos.x = e.stageX;
            this.touchPos.y = e.stageY;
        }
        onBgBtnMove(e) {
            this.doAimMove(e);
        }
        onBgBtnUp(e) {
            this.moveAimBg.visible = false;
            this.aimBtn.visible = true;
        }
        onAimBtnDown(e) {
            if (this.isStartGame == false) {
                this.startGame();
            }
            this.isMoveAimDown = false;
            if (this.isReloadingBullet) {
                this.onBgBtnDown(e);
                return;
            }
            this.isMoveAimDown = true;
            Game.instance.timeManager.clear(this, this.delayCloseAim);
            this.isCanFire = false;
            this.openAnim();
            this.showCancelAimBtn();
            this.touchPos.x = e.stageX;
            this.touchPos.y = e.stageY;
            Game.instance.eventManager.fire(EventType.ui_aimTouchDown);
        }
        onAimBtnUp(e) {
            this.aimBtn.x = this.aimBtnPos.x;
            this.aimBtn.y = this.aimBtnPos.y;
            this.moveAimBg.visible = false;
            if (!this.isMoveAimDown) {
                this.onBgBtnUp(e);
                return;
            }
            this.isMoveAimDown = false;
            if (this.curBulletCount > 0 && this.isCanFire) {
                BattleManager.instance.heroManager.shoot();
                Game.instance.eventManager.fire(EventType.ui_shoot);
                this.curBulletCount--;
                this.showBulletInfo();
                if (this.curBulletCount <= 0) {
                    this.startReload();
                }
                Game.instance.timeManager.onceExecute(0.7, this, this.delayCloseAim);
                Game.instance.timeManager.onceExecute(1, this, this.doShowAimBtn);
            }
            else {
                Game.instance.timeManager.onceExecute(0.3, this, this.doShowAimBtn);
                this.closeAim();
            }
            Game.instance.eventManager.fire(EventType.ui_aimTouchUp);
            this.isCanFire = false;
        }
        onAimBtnMove(e) {
            this.doAimMove(e);
            this.point.x = e.stageX;
            this.point.y = e.stageY;
            this.point = this.aimBtn.parent.globalToLocal(this.point);
            this.aimBtn.x = this.point.x;
            this.aimBtn.y = this.point.y;
        }
        doAimMove(e) {
            let scaleNum = 2;
            let angleX = (e.stageX - this.touchPos.x) * scaleNum;
            let angleY = (e.stageY - this.touchPos.y) * scaleNum;
            Game.instance.timeManager.frameOnce(1, this, function () {
                BattleManager.instance.cameraLogic.moveAim(-angleX, angleY);
            });
            this.touchPos.x = e.stageX;
            this.touchPos.y = e.stageY;
        }
    }

    class FailView extends ui.FailViewUI {
        constructor() { super(); }
        onAwake() {
        }
        init(gameOverType) {
            this.initObj();
            let desc = "";
            switch (gameOverType) {
                case GameOverType.enemy_escape:
                    desc = "敌人逃跑了";
                    break;
                case GameOverType.hostage_shooted:
                    desc = "人质被射杀了";
                    break;
                case GameOverType.shooted:
                    desc = "你没血了";
                    break;
                default:
                    break;
            }
            this.failDesc.text = desc;
            console.log("游戏失败了  ====== " + desc);
        }
        initObj() {
            this.restartBtn.on(Laya.Event.CLICK, this, this.onRestartBtnClick);
        }
        showInfo() {
        }
        onRestartBtnClick() {
            Game.instance.eventManager.fire(EventType.reset_Game);
            Game.instance.scenesManager.openScene(ConstantConfig.BattleView, Laya.Handler.create(this, function (scene) {
                Game.instance.setSceneUI(scene);
            }));
        }
    }

    class LoadingView extends ui.LoadingViewUI {
        constructor() {
            super();
            this.allLoadCount = 0;
            this.curLoadCount = 0;
            this.isLoading = false;
        }
        onAwake() {
            this.init();
        }
        onEnable() {
        }
        init() {
            Game.instance.timeManager.framLoop(this, this.updateProgress);
            Game.instance.userData.loadCache();
            this.loadConfig();
            this.loadRes();
            this.isLoading = true;
        }
        updateProgress() {
            if (!this.isLoading) {
                return;
            }
            let p = 0;
            if (this.allLoadCount > 0) {
                p = this.curLoadCount / this.allLoadCount;
            }
            if (this.allLoadCount <= this.curLoadCount) {
                this.isLoading = false;
                this.allLoadComplete();
            }
        }
        allLoadComplete() {
            this.startLoadScene3D();
        }
        loadRes() {
            if (Laya.Browser.onMiniGame) {
                this.startLoadSubpackage();
            }
            else {
            }
        }
        startLoadSubpackage() {
            this.doLoadSubpackage('unity');
        }
        doLoadSubpackage(name) {
            this.allLoadCount += 30;
            let self = this;
            const loadTask = wx.loadSubpackage({
                name: name,
                success: function (res) {
                    self.curLoadCount += 30;
                },
                fail: function (res) {
                }
            });
            loadTask.onProgressUpdate(function (res) {
            });
        }
        startLoadScene3D() {
            Game.instance.scenesManager.loadScene3D(ConstantConfig.battleScenePath, Laya.Handler.create(this, this.loadScene3DComplete));
        }
        loadScene3DComplete(scene) {
            Game.instance.setScene3D(scene);
            Game.instance.scene3D.addComponent(BattleManager);
            Game.instance.scenesManager.openScene(ConstantConfig.BattleView, Laya.Handler.create(this, function (scene) {
                Game.instance.setSceneUI(scene);
            }));
        }
        loadConfig() {
            this.load("config/StageConfig.json", function (data) {
                Game.instance.userData.loadStageConfig(data);
            });
            this.load("config/EnemyConfig.json", function (data) {
                Game.instance.userData.loadEnemyConfig(data);
            });
            this.load("config/MissionConfig.json", function (data) {
                Game.instance.userData.loadMissionConfig(data);
            });
        }
        load(pathName, callBack) {
            this.allLoadCount++;
            let self = this;
            Game.instance.loadManager.load(pathName, function (res) {
                callBack(res);
                self.curLoadCount++;
            });
        }
    }

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            var scene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            var box = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex) {
                material.albedoTexture = tex;
            }));
            box.meshRenderer.material = material;
        }
    }

    class VictoryView extends ui.VictoryViewUI {
        constructor() { super(); }
        onAwake() {
            this.init();
        }
        init() {
            this.initObj();
            this.showInfo();
        }
        initObj() {
            this.nextBtn.on(Laya.Event.CLICK, this, this.onNextBtnClick);
        }
        showInfo() {
            let stageLevel = Game.instance.userData.mStageLevel;
            this.title.text = "任 务 " + stageLevel;
            Game.instance.userData.nextStage();
        }
        onNextBtnClick() {
            Game.instance.eventManager.fire(EventType.reset_Game);
            Game.instance.scenesManager.openScene(ConstantConfig.BattleView, Laya.Handler.create(this, function (scene) {
                Game.instance.setSceneUI(scene);
            }));
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("View/BattleView.ts", BattleView);
            reg("View/FailView.ts", FailView);
            reg("View/LoadingView.ts", LoadingView);
            reg("script/GameUI.ts", GameUI);
            reg("View/VictoryView.ts", VictoryView);
        }
    }
    GameConfig.width = 720;
    GameConfig.height = 1280;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "LoadingView.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = true;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            Game.instance.init();
        }
    }
    new Main();

}());
