import React, { useState, useEffect } from 'react';
import api from "../../services/api";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col,
  Input as AntInput,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const ListUsersRoles = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data?.users) ? response.data.users : []);
    } catch (error) {
      message.error('Erreur lors du chargement des utilisateurs');
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(Array.isArray(response.data?.roles) ? response.data.roles : []);
    } catch (error) {
      message.error('Erreur lors du chargement des rôles');
      console.error(error);
      setRoles([]);
    }
  };

  const showModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles?.map(r => r.id) || [],
      });
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, values);
        message.success('Utilisateur modifié avec succès');
      } else {
        await api.post('/users', values);
        message.success('Utilisateur créé avec succès');
      }
      fetchUsers();
      handleCancel();
    } catch (error) {
      message.error('Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      message.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      message.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const filteredUsers = (users || []).filter(user =>
    user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rôles',
      key: 'roles',
      render: (_, record) => (
        <div>
          {record.roles?.length > 0 ? (
            record.roles.map(role => (
              <Tag key={role.id} color="blue" style={{ marginBottom: '4px' }}>
                {role.nom}
              </Tag>
            ))
          ) : (
            <Tag color="default">Aucun rôle</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer cet utilisateur ?"
            description="Cette action est irréversible."
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={16}>
        <Col span={24}>
          <Card
            title="Gestion des Utilisateurs et Rôles"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
              >
                Ajouter un utilisateur
              </Button>
            }
          >
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={24} md={12} lg={8}>
                <AntInput
                  placeholder="Rechercher par nom ou email..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredUsers}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} sur ${total} utilisateurs`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="Enregistrer"
        cancelText="Annuler"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {editingUser && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Nom"
                name="name"
                rules={[{ required: true, message: 'Le nom est requis' }]}
              >
                <Input placeholder="Entrez le nom complet" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'L\'email est requis' },
                  { type: 'email', message: 'Format d\'email invalide' },
                ]}
              >
                <Input placeholder="Entrez l'adresse email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Rôles"
                name="roles"
                rules={[{ required: true, message: 'Au moins un rôle est requis' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Sélectionnez les rôles"
                  style={{ width: '100%' }}
                  options={roles?.map(role => ({
                    label: role.nom,
                    value: role.id,
                  })) || []}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ListUsersRoles;
