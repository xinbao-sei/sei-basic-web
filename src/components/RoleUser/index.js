import React from 'react';
import { List, Skeleton, Avatar } from "antd";
import { ScrollBar } from 'seid'

const RoleUser = ({ userData = [], loading }) => {
    return (
        <ScrollBar>
            <List
                dataSource={userData}
                loading={loading}
                renderItem={item => (
                    <List.Item key={item.id}>
                        <Skeleton avatar loading={loading} active>
                            <List.Item.Meta
                                avatar={<Avatar icon='user' />}
                                title={item.userName}
                                description={item.userType}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </ScrollBar>
    )
};

export default RoleUser;