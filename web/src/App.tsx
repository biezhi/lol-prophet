import { Button, Checkbox, Col, Form, FormInstance, Input, InputNumber, message, Modal, Row, Select, Space, Switch, Table } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import type { ColumnsType } from 'antd/lib/table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { blackBatchSummoner, blackSummoner, champions, Config, getAllConfig, getSummoner, querySummonerScore, SummonerItem, SummonerMap, updateConfig } from './api'
import "./App.less"

const defaultHorseName = ['通天代', '小代', '上等马', '中等马', '下等马', '牛马']

const defaultCfg: Config = {
  autoAcceptGame: false,
  autoPickChampID: 0,
  autoBanChampID: 0,
  autoSendTeamHorse: true,
  shouldSendSelfHorse: true,
  horseNameConf: defaultHorseName,
  chooseSendHorseMsg: [true, true, true, true, true, true],
  chooseChampSendMsgDelaySec: 3,
  shouldInGameSaveMsgToClipBoard: true,
  shouldAutoOpenBrowser: true,
}

const switchList = [
  {
    name: 'autoAcceptGame',
    label: '是否自动接受对局'
  },
  {
    name: 'autoSendTeamHorse',
    label: '是否自动发送消息到选人界面'
  },
  {
    name: 'shouldSendSelfHorse',
    label: '是否发送自己马匹信息'
  },
  {
    name: 'shouldInGameSaveMsgToClipBoard',
    label: '是否复制敌方马匹信息'
  },
  {
    name: 'shouldAutoOpenBrowser',
    label: '是否自动打开浏览器'
  },
]


export default function App() {
  const [form] = Form.useForm();
  const [horseNameConf, setHorseNameConf] = useState(defaultHorseName)

  const getInitConfig = async () => {
    const { data } = await getAllConfig()
    setHorseNameConf(data.horseNameConf)
    form.setFieldsValue({
      ...data,
      chooseSendHorseMsg: data.chooseSendHorseMsg.reduce<number[]>((pre, cur, index) => cur ? [...pre, index] : pre, [])
    })
  }

  useEffect(() => {
    getInitConfig()
  }, [])

  return (
    <div className='main'>
      <h3>配置选项</h3>
      <Form
        form={form}
        onFinish={async (value) => {
          await updateConfig({
            ...value,
            chooseSendHorseMsg: defaultCfg.chooseSendHorseMsg.map((_, i) => value.chooseSendHorseMsg.includes(i)),
          })
          message.info('更新成功')
        }
        }
      >
        <Row gutter={24} className='config'>
          {
            switchList.map((item, i) => (
              <Col span={8} key={i} >
                <Form.Item name={item.name} label={item.label} valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            ))
          }
        </Row>
        <Row gutter={24}>
          <Col span={8} >
            <Form.Item name='autoPickChampID' label='是否自动秒选英雄'>
              <Select<number>
                showSearch
                placeholder="选择英雄"
                filterOption={(input, option) => {
                  return option?.label?.toString().includes(input) || option?.nicks?.some((i: string) => i.includes(input))
                }}
                options={champions.map(v => {
                  return { label: v.name, value: v.id, nicks: v.nicks }
                })}
              ></Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name='autoBanChampID' label='是否自动ban人' >
              <Select<number>
                showSearch
                placeholder="选择英雄"
                filterOption={(input, option) => {
                  return option?.label?.toString().includes(input) || option?.nicks?.some((i: string) => i.includes(input))
                }}
                options={champions.map(v => {
                  return { label: v.name, value: v.id, nicks: v.nicks }
                })}
              ></Select>
            </Form.Item>
          </Col>

        </Row>

        <Form.Item label="马匹名称">
          <Row gutter={24}>
            {horseNameConf.map((v, k) => {
              return (
                <Col key={k} span={4} >
                  <Form.Item name={["horseNameConf", k]}>
                    <Input
                      placeholder={horseNameConf[k]}
                      onChange={e => {
                        const copy = [...horseNameConf]
                        copy.splice(k, 1, e.target.value)
                        setHorseNameConf(copy)
                      }}
                    />
                  </Form.Item>
                </Col>
              )
            })}

          </Row>
        </Form.Item>
        <Form.Item label="发送哪些马匹信息" name={'chooseSendHorseMsg'}>
          <Checkbox.Group
            options={horseNameConf.map((v, k) => {
              return {
                label: v,
                value: k,
              }
            })}
          />
        </Form.Item>
        <Form.Item label="进入选人阶段n秒" name={'chooseChampSendMsgDelaySec'}>
          <InputNumber
            min={0}
            max={20}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
      <Features />
      <PullBlack />
    </div>
  )
}
const Features = () => {
  return (
    <>
      <h3>功能</h3>
      <Space>
        <Form
          layout="inline"
          onFinish={() => {
            querySummonerScore('')
              .then(resp => {
                message.info(`自己马匹信息:${resp.data.horse},得分:${resp.data.score.toFixed(2)}`, 2)
              })
          }}
        >
          <Form.Item label="查询自己马匹信息">
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <Form
          layout="inline"
          onFinish={async ({ name }) => {
            const { data } = await querySummonerScore(name)
            message.info(`${name}马匹信息:${data.horse},得分:${data.score.toFixed(2)}`, 3)
          }}
        >
          <Form.Item name="name" label="查询用户马匹信息" rules={[{ required: true, message: '名称必填' }]}>
            <Input
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </>

  )
}

const PullBlack = () => {
  const [userData, setData] = useState<SummonerMap>({
    selfTeam: [],
    enemyTeam: [],
    blackUsers: []
  })
  const [visible, setVisible] = useState<boolean | number>(false);
  const [visibleAll, setVisibleAll] = useState<boolean>(false);
  const _ = useWebSocket('ws://localhost:4396/ws', {
    onMessage: (data) => {
      const message = JSON.parse(data.data)
      if (message.type == 'summonerMap') {
        setData(message.data)
        if (message.data?.blackUsers?.length > 0) {
          if (window.Notification.permission == "granted") {
            new Notification("遇到拉黑的沙雕")
          } else if (window.Notification.permission != "denied") {
            window.Notification.requestPermission(function (permission) {
              new Notification("遇到拉黑的沙雕")
            });
          }
        }
      }
    },
  });

  const getData = async () => {
    const { data } = await getSummoner()
    setData(data)
  }
  const summonerList = useMemo(() => [...userData?.selfTeam, ...userData?.enemyTeam], [userData])

  const columns: ColumnsType<SummonerItem> = [
    {
      title: 'ID',
      dataIndex: 'summonerName',
      key: 'summonerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <a onClick={() => setVisible(record.summonerID)}>拉黑</a>
      ),
    },
  ]

  const blockCloumns = [
    {
      title: 'ID',
      dataIndex: 'summonerName',
      key: 'summonerName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '拉黑理由',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
      ellipsis: true,
    },
  ]

  return (
    <Space direction='vertical'>
      <h3>拉黑</h3>
      <Space>
        <Button onClick={() => getData()}>手动获取对局用户</Button>
        <Button type='primary' onClick={() => { setVisible(true) }}>拉黑指定辣鸡</Button>
        <Button
          onClick={() => {
            setVisibleAll(true)
          }}
          disabled={!summonerList.length}
        >批量拉黑
        </Button>
      </Space>
      <Row gutter={16}>
        <Col span={8}>
          <Table
            title={() => '我方'}
            rowKey='summonerID'
            columns={columns}
            dataSource={userData?.selfTeam ?? []}
            pagination={false}
          />
        </Col>
        <Col span={8}>
          <Table
            title={() => '敌方'}
            rowKey='summonerID'
            columns={columns}
            dataSource={userData?.enemyTeam ?? []}
            pagination={false}
          />
        </Col>
        <Col span={8}>
          <Table
            title={() => '已拉黑'}
            rowKey='summonerID'
            columns={blockCloumns}
            dataSource={userData?.blackUsers ?? []}
            pagination={false}
          />
        </Col>
      </Row>
      <BlockModal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }} />
      <BlockBatchModal
        visible={visibleAll}
        summonerList={summonerList}
        onCancel={() => { setVisibleAll(false) }}
      />
    </Space>
  )
}


interface ModalFormProps {
  visible: boolean | number;
  onCancel: () => void;
}

const BlockModal: React.FC<ModalFormProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const isSpecify = useMemo(() => typeof visible == 'boolean', [visible])
  return (
    <Modal
      title="拉黑"
      okText="确定"
      cancelText="取消"
      visible={!!visible}
      onOk={() => {
        form
          .validateFields()
          .then(async values => {
            await blackSummoner(isSpecify ? { ...values } : { ...values, summonerID: visible })
            message.info('拉黑成功')
            form.resetFields();
          })
          .catch(info => {
            console.log(info);
          }).finally(() =>
            onCancel()
          );
      }}
      onCancel={() => {
        form.resetFields();
        onCancel()
      }}
    >
      <Form
        form={form}
        layout="vertical"
      >
        {isSpecify && <Form.Item
          name="summonerName"
          label="辣鸡名字"
          rules={[{ required: true, message: '辣鸡名字！' }]}
        >
          <Input />
        </Form.Item>}
        <Form.Item name="reason" label="理由">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
const BlockBatchModal: React.FC<ModalFormProps & { summonerList: SummonerItem[] }> = ({ visible, onCancel, summonerList }) => {
  const [form] = Form.useForm();

  const option = useMemo(() => {
    return summonerList?.map((item: SummonerItem) => ({
      label: item.summonerName,
      value: item.summonerID
    }))
  }, [summonerList])
  return (
    <Modal
      title="批量拉黑"
      okText="确定"
      cancelText="取消"
      visible={!!visible}
      onOk={() => {
        form
          .validateFields()
          .then(async values => {
            await blackBatchSummoner({ list: summonerList?.filter(f => values?.list?.includes(f.summonerID)), reason: values?.reason })
            message.info('拉黑成功')
            form.resetFields();
          }).finally(() =>
            onCancel()
          );
      }}
      onCancel={() => {
        form.resetFields();
        onCancel()
      }}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name="list" label="批量选择" rules={[{ required: true, message: '请选择！' }]}>
          <CheckboxGroup option={option} />
        </Form.Item>
        <Form.Item name="reason" label="理由">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
interface CheckboxGroupProps {
  option: CheckboxOptionType[]
  value?: CheckboxValueType[];
  onChange?: (value: CheckboxValueType[]) => void;
}
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ option, value, onChange }) => {
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(value ?? []);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  const onGroupChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    onChange?.(list)
    setIndeterminate(!!list.length && list.length < option.length);
    setCheckAll(list.length === option.length);
  };

  const allList = option?.map(i => i.value)

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? allList : []);
    onChange?.(e.target.checked ? allList : [])
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };


  return (
    <>
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <Checkbox.Group options={option} value={checkedList} onChange={onGroupChange} />
    </>
  );
};
