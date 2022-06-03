import axios from "axios"
import { message } from 'antd';
axios.defaults.baseURL = 'http://127.0.0.1:4396'
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        message.error('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.code != 0) {
        if (res.data.msg) message.error(res.data.msg)
        return Promise.reject(res.data)
    }

    return res.data
})
export interface Config {
    autoAcceptGame: boolean
    autoPickChampID: number
    autoBanChampID: number
    autoSendTeamHorse: boolean
    shouldSendSelfHorse: boolean
    horseNameConf: string[]
    chooseSendHorseMsg: boolean[]
    chooseChampSendMsgDelaySec: number
    shouldInGameSaveMsgToClipBoard: boolean
    shouldAutoOpenBrowser: boolean
}
export interface HorseInfo {
    horse: string
    score: number
    currKDA: string[]
}
export interface SummonerItem {
    summonerID: number
    summonerName: string
}
export interface SummonerMap {
    selfTeam: SummonerItem[]
    enemyTeam: SummonerItem[]
    blackUsers: SummonerItem[]
}
export interface BlockInfo {
    summonerName?: string
    summonerID?: number
    reason?: string
}
export interface BlockBatchInfo {
    list: {
        summonerName: string
        summonerID: number
    }[]
    reason?: string
}
export const getAllConfig = () => {
    return axios.post<Config>('/v1/config/getAll')
}

export const updateConfig = (data: Config) => {
    return axios.post('/v1/config/update', data)
}

export const querySummonerScore = (summonerName: string) => {
    return axios.post<HorseInfo>('/v1/horse/queryBySummonerName', { summonerName })
}
export const getSummoner = () => {
    return axios.get<SummonerMap>('/v1/app/getSummoner')
}
export const blackSummoner = (data: BlockInfo) => {
    return axios.post('/v1/app/blackSummoner', data)
}
export const blackBatchSummoner = (data: BlockBatchInfo) => {
    return axios.post('/v1/app/blackBatchSummoner', data)
}
export const champions = [
    { id: 0, name: '无' },
    { id: 1, name: '黑暗之女', nicks: ['火女', '安妮'] },
    { id: 2, name: '狂战士', nicks: ['奥拉夫'] },
    { id: 3, name: '正义巨像', nicks: ['加里奥'] },
    { id: 4, name: '卡牌大师', nicks: [] },
    { id: 5, name: '德邦总管', nicks: ['菊花', '赵信'] },
    { id: 6, name: '无畏战车', nicks: ['螃蟹'] },
    { id: 7, name: '诡术妖姬', nicks: [] },
    { id: 8, name: '猩红收割者', nicks: ['吸血鬼'] },
    { id: 9, name: '远古恐惧', nicks: ['末日'] },
    { id: 10, name: '正义天使', nicks: ['天使'] },
    { id: 11, name: '无极剑圣', nicks: ['js'] },
    { id: 12, name: '牛头酋长', nicks: [] },
    { id: 13, name: '符文法师', nicks: ['流浪'] },
    { id: 14, name: '亡灵战神', nicks: ['塞恩', '霸哥'] },
    { id: 15, name: '战争女神', nicks: ['轮子妈'] },
    { id: 16, name: '众星之子', nicks: ['奶妈'] },
    { id: 17, name: '迅捷斥候', nicks: ['提莫'] },
    { id: 18, name: '麦林炮手', nicks: ['小炮'] },
    { id: 19, name: '祖安怒兽', nicks: ['狼人'] },
    { id: 20, name: '雪原双子', nicks: ['努努'] },
    { id: 21, name: '赏金猎人', nicks: ['mf', '女枪'] },
    { id: 22, name: '寒冰射手', nicks: [] },
    { id: 23, name: '蛮族之王', nicks: ['蛮王', '三刀'] },
    { id: 24, name: '武器大师', nicks: [] },
    { id: 25, name: '堕落天使', nicks: ['莫甘娜'] },
    { id: 26, name: '时光守护者', nicks: [] },
    { id: 27, name: '炼金术士', nicks: [] },
    { id: 28, name: '痛苦之拥', nicks: ['寡妇'] },
    { id: 29, name: '瘟疫之源', nicks: ['老鼠'] },
    { id: 30, name: '死亡颂唱者', nicks: ['死歌'] },
    { id: 31, name: '虚空恐惧', nicks: ['大虫子'] },
    { id: 32, name: '殇之木乃伊', nicks: ['木木'] },
    { id: 33, name: '披甲龙龟', nicks: [] },
    { id: 34, name: '冰晶凤凰', nicks: ['冰鸟'] },
    { id: 35, name: '恶魔小丑', nicks: [] },
    { id: 36, name: '祖安狂人', nicks: ['蒙多'] },
    { id: 37, name: '琴瑟仙女', nicks: ['奶'] },
    { id: 38, name: '虚空行者', nicks: ['卡萨丁'] },
    { id: 39, name: '刀锋舞者', nicks: ['女刀'] },
    { id: 40, name: '风暴之怒', nicks: ['风女'] },
    { id: 41, name: '海洋之灾', nicks: ['船长'] },
    { id: 42, name: '英勇投弹手', nicks: ['飞机'] },
    { id: 43, name: '天启者', nicks: ['扇子妈'] },
    { id: 44, name: '瓦洛兰之盾', nicks: ['宝石'] },
    { id: 45, name: '邪恶小法师', nicks: ['维嘉'] },
    { id: 48, name: '巨魔之王', nicks: [] },
    { id: 50, name: '诺克萨斯统领', nicks: ['乌鸦'] },
    { id: 51, name: '皮城女警', nicks: [] },
    { id: 53, name: '蒸汽机器人', nicks: [] },
    { id: 54, name: '熔岩巨兽', nicks: ['石头', '霸哥'] },
    { id: 55, name: '不祥之刃', nicks: ['卡特'] },
    { id: 56, name: '永恒梦魇', nicks: [] },
    { id: 57, name: '扭曲树精', nicks: ['大树'] },
    { id: 58, name: '荒漠屠夫', nicks: ['鳄鱼'] },
    { id: 59, name: '德玛西亚皇子', nicks: [] },
    { id: 60, name: '蜘蛛女皇', nicks: [] },
    { id: 61, name: '发条魔灵', nicks: [] },
    { id: 62, name: '齐天大圣', nicks: ['猴子', '孙悟空'] },
    { id: 63, name: '复仇焰魂', nicks: ['火男'] },
    { id: 64, name: '盲僧', nicks: ['瞎子'] },
    { id: 67, name: '暗夜猎手', nicks: ['vn'] },
    { id: 68, name: '机械公敌', nicks: ['兰博', '蓝宝'] },
    { id: 69, name: '魔蛇之拥', nicks: ['蛇女', '秃子', '莎莉'] },
    { id: 72, name: '水晶先锋', nicks: ['蝎子'] },
    { id: 74, name: '大发明家', nicks: ['大头'] },
    { id: 75, name: '沙漠死神', nicks: ['狗头'] },
    { id: 76, name: '狂野女猎手', nicks: ['豹女'] },
    { id: 77, name: '兽灵行者', nicks: [] },
    { id: 78, name: '圣锤之毅', nicks: ['波比'] },
    { id: 79, name: '酒桶', nicks: [] },
    { id: 80, name: '不屈之枪', nicks: ['ps', '潘森', '斯巴达'] },
    { id: 81, name: '探险家', nicks: ['ez'] },
    { id: 82, name: '铁铠冥魂', nicks: ['铁皮', '金属大师'] },
    { id: 83, name: '牧魂人', nicks: [] },
    { id: 84, name: '离群之刺', nicks: ['阿卡丽'] },
    { id: 85, name: '狂暴之心', nicks: ['凯南'] },
    { id: 86, name: '德玛西亚之力', nicks: [] },
    { id: 89, name: '曙光女神', nicks: [] },
    { id: 90, name: '虚空先知', nicks: [] },
    { id: 91, name: '刀锋之影', nicks: [] },
    { id: 92, name: '放逐之刃', nicks: [] },
    { id: 96, name: '深渊巨口', nicks: [] },
    { id: 98, name: '暮光之眼', nicks: [] },
    { id: 99, name: '光辉女郎', nicks: [] },
    { id: 101, name: '远古巫灵', nicks: [] },
    { id: 102, name: '龙血武姬', nicks: [] },
    { id: 103, name: '九尾妖狐', nicks: [] },
    { id: 104, name: '法外狂徒', nicks: [] },
    { id: 105, name: '潮汐海灵', nicks: [] },
    { id: 106, name: '不灭狂雷', nicks: [] },
    { id: 107, name: '傲之追猎者', nicks: [] },
    { id: 110, name: '惩戒之箭', nicks: [] },
    { id: 111, name: '深海泰坦', nicks: [] },
    { id: 112, name: '机械先驱', nicks: [] },
    { id: 113, name: '北地之怒', nicks: [] },
    { id: 114, name: '无双剑姬', nicks: [] },
    { id: 115, name: '爆破鬼才', nicks: [] },
    { id: 117, name: '仙灵女巫', nicks: [] },
    { id: 119, name: '荣耀行刑官', nicks: [] },
    { id: 120, name: '战争之影', nicks: [] },
    { id: 121, name: '虚空掠夺者', nicks: [] },
    { id: 122, name: '诺克萨斯之手', nicks: [] },
    { id: 126, name: '未来守护者', nicks: [] },
    { id: 127, name: '冰霜女巫', nicks: [] },
    { id: 131, name: '皎月女神', nicks: [] },
    { id: 133, name: '德玛西亚之翼', nicks: [] },
    { id: 134, name: '暗黑元首', nicks: [] },
    { id: 136, name: '铸星龙王', nicks: [] },
    { id: 141, name: '影流之镰', nicks: [] },
    { id: 142, name: '暮光星灵', nicks: [] },
    { id: 143, name: '荆棘之兴', nicks: [] },
    { id: 145, name: '虚空之女', nicks: [] },
    { id: 147, name: '星籁歌姬', nicks: [] },
    { id: 150, name: '迷失之牙', nicks: [] },
    { id: 154, name: '生化魔人', nicks: [] },
    { id: 157, name: '疾风剑豪', nicks: ['亚缩'] },
    { id: 161, name: '虚空之眼', nicks: [] },
    { id: 163, name: '岩雀', nicks: [] },
    { id: 164, name: '青钢影', nicks: [] },
    { id: 166, name: '影哨', nicks: [] },
    { id: 201, name: '弗雷尔卓德之心', nicks: [] },
    { id: 202, name: '戏命师', nicks: [] },
    { id: 203, name: '永猎双子', nicks: [] },
    { id: 221, name: '祖安花火', nicks: [] },
    { id: 222, name: '暴走萝莉', nicks: [] },
    { id: 223, name: '河流之王', nicks: [] },
    { id: 234, name: '破败之王', nicks: [] },
    { id: 235, name: '涤魂圣枪', nicks: [] },
    { id: 236, name: '圣枪游侠', nicks: [] },
    { id: 238, name: '影流之主', nicks: [] },
    { id: 240, name: '暴怒骑士', nicks: [] },
    { id: 245, name: '时间刺客', nicks: [] },
    { id: 246, name: '元素女皇', nicks: [] },
    { id: 254, name: '皮城执法官', nicks: [] },
    { id: 266, name: '暗裔剑魔', nicks: [] },
    { id: 267, name: '唤潮鲛姬', nicks: [] },
    { id: 268, name: '沙漠皇帝', nicks: [] },
    { id: 350, name: '魔法猫咪', nicks: [] },
    { id: 360, name: '沙漠玫瑰', nicks: [] },
    { id: 412, name: '魂锁典狱长', nicks: [] },
    { id: 420, name: '海兽祭司', nicks: [] },
    { id: 421, name: '虚空遁地兽', nicks: [] },
    { id: 427, name: '翠神', nicks: [] },
    { id: 429, name: '复仇之矛', nicks: [] },
    { id: 432, name: '星界游神', nicks: [] },
    { id: 497, name: '幻翎', nicks: [] },
    { id: 498, name: '逆羽', nicks: [] },
    { id: 516, name: '山隐之焰', nicks: [] },
    { id: 517, name: '解脱者', nicks: [] },
    { id: 518, name: '万花通灵', nicks: [] },
    { id: 523, name: '残月之肃', nicks: [] },
    { id: 526, name: '镕铁少女', nicks: [] },
    { id: 555, name: '血港鬼影', nicks: [] },
    { id: 711, name: '愁云使者', nicks: [] },
    { id: 777, name: '封魔剑魂', nicks: [] },
    { id: 875, name: '腕豪', nicks: [] },
    { id: 876, name: '含羞蓓蕾', nicks: [] },
    { id: 887, name: '灵罗娃娃', nicks: [] },
    { id: 888, name: '炼金男爵', nicks: [] },
]