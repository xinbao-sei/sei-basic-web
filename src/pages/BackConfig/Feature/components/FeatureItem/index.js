import React, { Component } from "react";
import cls from 'classnames';
import { connect } from "dva";
import isEqual from 'react-fast-compare';
import { formatMessage } from "umi-plugin-react/locale";
import { Input, Pagination, List, Skeleton, Popconfirm, Drawer, Tag } from "antd";
import { ScrollBar, ExtIcon } from 'seid';
import FeatureItemAdd from './Form/add';
import FeatureItemEdit from './Form/edit';
import styles from "./index.less";

const Search = Input.Search;

@connect(({ feature, featureGroup, loading }) => ({ feature, featureGroup, loading }))
class FeatureItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delFeatureId: null,
            listData: [],
            pagination: {
                current: 1,
                pageSize: 30,
                total: 0,
            },
        };
    }

    static allValue = '';
    static data = [];

    componentDidUpdate(prevProps) {
        const { feature } = this.props;
        if (!isEqual(prevProps.feature.listData, feature.listData)) {
            const { pagination } = this.state;
            const { listData } = feature;
            this.data = [...listData];
            this.setState({
                listData,
                pagination: {
                    ...pagination,
                    total: listData.length,
                },
            });
        }
        if (!isEqual(feature.currentPageRow, prevProps.feature.currentPageRow)) {
            this.reloadFeatrueData();
        }
    };

    reloadFeatrueData = () => {
        const { feature, dispatch } = this.props;
        const { currentPageRow } = feature;
        if (currentPageRow) {
            dispatch({
                type: "feature/getFeatureItemList",
                payload: {
                    featureId: currentPageRow.id,
                }
            });
        }
    };

    handlerSearchChange = (v) => {
        this.allValue = v;
    };

    handlerSearch = () => {
        const { pagination, } = this.state;
        let listData = [];
        if (this.allValue) {
            const valueKey = this.allValue.toLowerCase();
            listData = this.data.filter(ds => ds.name.toLowerCase().indexOf(valueKey) > -1 || ds.code.toLowerCase().indexOf(valueKey) > -1);
        } else {
            listData = [...this.data];
        }
        this.setState({
            listData,
            pagination: {
                ...pagination,
                total: listData.length,
            },
        });
    };

    handlerPageChange = (current, pageSize) => {
        const { pagination } = this.state;
        this.setState(
            {
                pagination: {
                    ...pagination,
                    current,
                    pageSize,
                },
            },
            () => {
                const newData = this.getLocalFilterData();
                const listData = newData.slice((current - 1) * pageSize, current * pageSize);
                this.setState({
                    listData,
                });
            },
        );
    };

    save = (data, handlerPopoverHide) => {
        const { dispatch } = this.props;
        dispatch({
            type: "feature/saveFeature",
            payload: {
                ...data
            },
            callback: res => {
                if (res.success) {
                    handlerPopoverHide && handlerPopoverHide();
                    this.reloadFeatrueData();
                }
            }
        });
    };

    del = record => {
        const { dispatch } = this.props;
        this.setState({
            delFeatureId: record.id
        }, _ => {
            dispatch({
                type: "feature/delFeature",
                payload: {
                    id: record.id
                },
                callback: res => {
                    if (res.success) {
                        this.setState({
                            delFeatureId: null
                        });
                        this.reloadFeatrueData();
                    }
                }
            });
        });
    };

    handlerClose = () => {
        const { dispatch } = this.props;
        dispatch({
            type: "feature/updateState",
            payload: {
                showFeatureItem: false,
                currentPageRow: null,
            }
        });
    };

    renderItemTitle = (item) => {
        return (
            <>
                {item.name}
                <span className='code-box'>{item.code}</span>
                {
                    item.tenantCanUse
                        ? <Tag color='green'>租户可用</Tag>
                        : null
                }
            </>
        )
    };

    render() {
        const { loading, featureGroup, feature } = this.props;
        const { currentFeatureGroup } = featureGroup;
        const { currentPageRow, showFeatureItem } = feature;
        const { allValue, listData, pagination, delFeatureId } = this.state;
        const listLoading = loading.effects["feature/getFeatureItemList"];
        const saving = loading.effects["feature/saveFeature"];
        return (
            <Drawer
                width={480}
                destroyOnClose
                getContainer={false}
                placement="right"
                visible={showFeatureItem}
                title="功能项列表"
                className={cls(styles['feature-item-box'])}
                onClose={this.handlerClose}
                style={{ position: 'absolute' }}
            >
                <div className="header-tool-box">
                    <FeatureItemAdd
                        currentFeatureGroup={currentFeatureGroup}
                        currentPageRow={currentPageRow}
                        saving={saving}
                        save={this.save}
                    />
                    <Search
                        placeholder="输入名称关键字查询"
                        defaultValue={allValue}
                        onChange={e => this.handlerSearchChange(e.target.value)}
                        onSearch={this.handlerSearch}
                        onPressEnter={this.handlerSearch}
                        style={{ width: 172 }}
                    />
                </div>
                <div className="list-body">
                    <ScrollBar>
                        <List
                            dataSource={listData}
                            loading={listLoading}
                            renderItem={item => (
                                <List.Item key={item.id}>
                                    <Skeleton loading={listLoading} active>
                                        <List.Item.Meta
                                            title={this.renderItemTitle(item)}
                                            description={item.url}
                                        />
                                    </Skeleton>
                                    <div className='tool-action'>
                                        <FeatureItemEdit
                                            saving={saving}
                                            save={this.save}
                                            currentFeatureGroup={currentFeatureGroup}
                                            currentPageRow={currentPageRow}
                                            featureData={item}
                                        />
                                        <Popconfirm
                                            placement="topLeft"
                                            title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
                                            onConfirm={(e) => this.del(item, e)}
                                        >
                                            {
                                                loading.effects["feature/delFeature"] && delFeatureId === item.id
                                                    ? <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
                                                    : <ExtIcon className={cls('del', 'action-item')} type="delete" antd />
                                            }
                                        </Popconfirm>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </ScrollBar>
                </div>
                <div className="list-page-bar">
                    <Pagination
                        simple
                        onChange={this.handlerPageChange}
                        {...pagination}
                    />
                </div>
            </Drawer>
        )
    }
}

export default FeatureItem;