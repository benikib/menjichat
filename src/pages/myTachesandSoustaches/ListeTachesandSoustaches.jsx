import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, Select, Modal, Spin, Alert, Tag, Row, Col, Space, Typography, Table, Descriptions, Card } from 'antd';
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';

const { Title, Text } = Typography;

const ListeTachesandSoustaches = () => {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  

   // Assurez-vous que l'ID utilisateur est stocké dans le localStorage   

  const fetchTaches = useCallback(async () => {
    setLoading(true);
    try {
        const userId = useAuthStore.getState().user?.id; // Récupérer l'ID de l'utilisateur depuis le store
        if (!userId) {
          throw new Error("Utilisateur non authentifié");
        }
      const response = await api.get(`/users/mytachesandsofsstaches/${userId}`);
      setTaches(response.data || []);
      console.log('Tâches récupérées:', response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des tâches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaches();
  }, [fetchTaches]);

  const openModal = (item) => {
    if (!item?.tache) {
      return;
    }

    setEditingId(item.tache.id);
    form.setFieldsValue({
      statut: item.tache.statut || 'prevu',
    });
    setIsModalVisible(true);
  };

  const openDetailsModal = (record) => {
    setSelectedTask(record);
    setIsDetailsModalVisible(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setSelectedTask(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSubmitApi = async (payload) => {
    try {
      if (editingId) {
        await api.put(`/taches/${editingId}`, payload);
      } else {
        await api.post('/taches', payload);
      }
      setIsModalVisible(false);
      setEditingId(null);
      form.resetFields();
      fetchTaches();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const onFinish = (values) => {
    handleSubmitApi(values);
  };

  const columns = [
    {
      title: 'Tâche',
      dataIndex: ['tache', 'nom'],
      key: 'nom',
      render: (_, record) => record.tache?.nom || 'Tâche inconnue',
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Projet',
      dataIndex: ['tache', 'projet', 'nom'],
      key: 'projet',
      render: (_, record) => record.tache?.projet?.nom || 'Projet inconnu',
      ellipsis: true,
      width: 120,
    },
    {
      title: 'Description',
      dataIndex: ['tache', 'description'],
      key: 'description',
      render: (text) => text || 'Pas de description',
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Rôle',
      dataIndex: 'role_dans_tache',
      key: 'role',
      render: (value) => value || 'N/A',
      width: 100,
    },
    {
      title: 'Statut',
      dataIndex: ['tache', 'statut'],
      key: 'statut',
      render: (statut) => (
        <Tag color={getStatusColor(statut)} icon={getStatusIcon(statut)}>
          {statut || 'N/A'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Priorité',
      dataIndex: ['tache', 'priorite'],
      key: 'priorite',
      render: (priorite) => (
        <Tag color={getPriorityColor(priorite)}>
          {priorite || 'N/A'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Période',
      key: 'periode',
      render: (_, record) => {
        const debut = record.tache?.date_debut;
        const fin = record.tache?.date_fin;
        return debut && fin
          ? `${new Date(debut).toLocaleDateString()} – ${new Date(fin).toLocaleDateString()}`
          : 'N/A';
      },
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openDetailsModal(record)}>
            Voir plus
          </Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>
            Modifier
          </Button>
        </Space>
      ),
      width: 150,
    }
  ];

  const expandedRowRender = (record) => {
    const sousTaches = record.sous_tache
      ? Array.isArray(record.sous_tache)
        ? record.sous_tache
        : [record.sous_tache]
      : [];

    if (sousTaches.length === 0) {
      return <Text type="secondary">Pas de sous-tâches</Text>;
    }

    return (
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {sousTaches.map((soustache) => (
          <li key={soustache.id || `${record.id}-${soustache.nom}`} style={{ marginBottom: 8 }}>
            <Space>
              <input type="checkbox" defaultChecked={soustache.completed} readOnly />
              <span>{soustache.titre || soustache.nom}</span>
            </Space>
          </li>
        ))}
      </ul>
    );
  };

  const rowExpandable = (record) => {
    const sousTaches = record.sous_tache;
    return sousTaches && (Array.isArray(sousTaches) ? sousTaches.length > 0 : true);
  };

  const getStatusColor = (statut) => {
    const colors = {
      'prevu': 'blue',
      'en cours': 'orange',
      'termine': 'green',
      'En attente': 'red'
    };
    return colors[statut] || 'default';
  };

  const getPriorityColor = (priorite) => {
    const colors = {
      'haute': 'red',
      'moyenne': 'orange',
      'basse': 'green'
    };
    return colors[priorite] || 'default';
  };

  const getStatusIcon = (statut) => {
    const icons = {
      'prevu': <ClockCircleOutlined />,
      'en cours': <ExclamationCircleOutlined />,
      'termine': <CheckCircleOutlined />,
      'En attente': <ExclamationCircleOutlined />
    };
    return icons[statut] || <ClockCircleOutlined />;
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Mes Tâches et Sous-tâches
          </Title>
          <Text type="secondary">
            Gérez vos tâches assignées et leurs sous-tâches
          </Text>
        </Col>

      </Row>

      {loading ? (
        <Row justify="center" style={{ padding: '50px 0' }}>
          <Spin size="large" tip="Chargement de vos tâches..." />
        </Row>
      ) : error ? (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      ) : taches.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '50px 0' }}>
          <Text type="secondary">Aucune tâche assignée pour le moment</Text>
        </Card>
      ) : (
        <Table
          columns={columns}
          dataSource={taches}
          rowKey="id"
          expandable={{
            expandedRowRender,
            rowExpandable,
            expandRowByClick: true,
          }}
          pagination={{ pageSize: 10 }}
          loading={loading}
          bordered
          style={{ background: '#fff' }}
        />
      )}

      <Modal
        title={
          <Space>
            <EyeOutlined />
            Détails de la tâche
          </Space>
        }
        open={isDetailsModalVisible}
        onCancel={closeDetailsModal}
        footer={[
          <Button key="close" onClick={closeDetailsModal}>
            Fermer
          </Button>
        ]}
        width={800}
      >
        {selectedTask && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tâche" span={2}>
              {selectedTask.tache?.nom || 'Tâche inconnue'}
            </Descriptions.Item>
            <Descriptions.Item label="Projet">
              {selectedTask.tache?.projet?.nom || 'Projet inconnu'}
            </Descriptions.Item>
            <Descriptions.Item label="Rôle">
              {selectedTask.role_dans_tache || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedTask.tache?.description || 'Pas de description'}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={getStatusColor(selectedTask.tache?.statut)} icon={getStatusIcon(selectedTask.tache?.statut)}>
                {selectedTask.tache?.statut || 'N/A'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priorité">
              <Tag color={getPriorityColor(selectedTask.tache?.priorite)}>
                {selectedTask.tache?.priorite || 'N/A'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date de début">
              {selectedTask.tache?.date_debut ? new Date(selectedTask.tache.date_debut).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Date de fin">
              {selectedTask.tache?.date_fin ? new Date(selectedTask.tache.date_fin).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Durée">
              {selectedTask.tache?.duree ? `${selectedTask.tache.duree} jours` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Sous-tâches" span={2}>
              {selectedTask.sous_tache && (Array.isArray(selectedTask.sous_tache) ? selectedTask.sous_tache.length : 1) > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {(Array.isArray(selectedTask.sous_tache) ? selectedTask.sous_tache : [selectedTask.sous_tache]).map((soustache, index) => (
                    <li key={index}>
                      <Space>
                        <input type="checkbox" defaultChecked={soustache.completed} readOnly />
                        <span>{soustache.titre || soustache.nom}</span>
                      </Space>
                    </li>
                  ))}
                </ul>
              ) : (
                'Aucune sous-tâche'
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={
          <Space>
            <EditOutlined />
            Modifier le statut
          </Space>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="statut"
            label="Statut"
            rules={[{ required: true, message: 'Le statut est requis' }]}
          >
            <Select>
              <Select.Option value="prevu">Prévu</Select.Option>
              <Select.Option value="en cours">En cours</Select.Option>
              <Select.Option value="terminée">Terminée</Select.Option>
              <Select.Option value="en attente">En attente</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListeTachesandSoustaches;
