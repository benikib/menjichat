import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Select, DatePicker, Table, Modal, Space, Card, Row, Col, Progress, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const GestionTachesProjets = () => {
  const { projetId } = useParams();
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const editingTask = taches.find(t => t.id === editingId);

  // Créer un nouveau form quand on ouvre le modal
  useEffect(() => {
    if (isModalVisible && !editingId) {
      // Nouveau formulaire
      form.resetFields();
      form.setFieldsValue({
        statut: 'prevu',
        priorite: 'moyenne',
        duree: 1,
        projet_id: projetId
      });
    }
  }, [isModalVisible, editingId, form, projetId]);

  // Charger les tâches depuis l'API
  const fetchTaches = async () => {
    if (!projetId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`projets/${projetId}/taches`);
      console.log('Réponse API:', projetId, response.data);
      setTaches(response.data || []);        
      console.log('Tâches chargées:', response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projetId) {
      fetchTaches();
    }
  }, [projetId]);

  const getStatutColor = (statut) => {
    const colors = {
      'prevu': 'warning',
      'en cours': 'processing',
      'termine': 'success',
      'bloque': 'error'
    };
    return colors[statut] || 'default';
  };

  const getPrioriteColor = (priorite) => {
    const colors = {
      'haute': 'red',
      'moyenne': 'orange',
      'basse': 'green'
    };
    return colors[priorite] || 'blue';
  };

  const calculerPositionGantt = (tache) => {
    const dateDebut = dayjs('2026-01-01');
    const dateFin = dayjs('2026-12-31');
    const joursTotal = dateFin.diff(dateDebut, 'day');
    const joursDebut = dayjs(tache.date_debut).diff(dateDebut, 'day');
    const joursDuration = dayjs(tache.date_fin).diff(dayjs(tache.date_debut), 'day');

    return {
      left: Math.max(0, (joursDebut / joursTotal) * 100),
      width: Math.max(1, (joursDuration / joursTotal) * 100)
    };
  };

  const handleEdit = (tache) => {
    setEditingId(tache.id);
    form.setFieldsValue({
      ...tache,
      date_debut: dayjs(tache.date_debut),
      date_fin: dayjs(tache.date_fin),
      projet_id: projetId
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Confirmer la suppression',
      content: 'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      okText: 'Oui',
      cancelText: 'Non',
      onOk: async () => {
        try {
          await api.delete(`/taches/${id}`);
          fetchTaches(); // Recharger les données
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
        }
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleSubmitApi = async (payload) => {
    try {
      if (editingId) {
        // Modifier la tâche existante
        await api.put(`/taches/${editingId}`, payload);
      } else {
        // Ajouter une nouvelle tâche
        await api.post('/taches', payload);
      }
      console.log('Tâche sauvegardée avec succès'); 
      setIsModalVisible(false);
      setEditingId(null);
      fetchTaches(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // 🔥 calcul automatique durée
  const handleDatesChange = () => {
    const debut = form.getFieldValue("date_debut");
    const fin = form.getFieldValue("date_fin");

    if (debut && fin) {
      const duree = fin.diff(debut, "day");
      if (duree >= 0) {
        form.setFieldsValue({ duree });
      }
    }
  };

  // 🚀 SUBMIT FINAL
  const onFinish = (values) => {
    const payload = {
      ...values,
      date_debut: values.date_debut.format("YYYY-MM-DD"),
      date_fin: values.date_fin.format("YYYY-MM-DD"),
    };

    handleSubmitApi(payload);
  };

  const columns = [
    {
      title: 'Tâche',
      dataIndex: 'nom',
      key: 'nom',
      width: 200
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => <Tag color={getStatutColor(statut)}>{statut}</Tag>
    },
    {
      title: 'Priorité',
      dataIndex: 'priorite',
      key: 'priorite',
      render: (priorite) => <Tag color={getPrioriteColor(priorite)}>{priorite}</Tag>
    },
    {
      title: 'Assignés',
      key: 'assignees',
      render: (_, record) => (
        <div>
          {record.userstaches?.map(user => (
            <Tag key={user.id} color="blue">{user.name}</Tag>
          )) || 'Non assigné'}
        </div>
      )
    },
    {
      title: 'Durée (jours)',
      dataIndex: 'duree',
      key: 'duree'
    },
    {
      title: 'Date début',
      dataIndex: 'date_debut',
      key: 'date_debut',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Date fin',
      dataIndex: 'date_fin',
      key: 'date_fin',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Sous-tâches',
      key: 'sous_taches',
      render: (_, record) => record.sous_taches?.length || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card title="Gestion des Tâches du Projet" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              Nouvelle Tâche
            </Button>
          }>
            <Table
              columns={columns}
              dataSource={taches}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Diagramme de Gantt" style={{ marginBottom: '24px' }}>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '1200px' }}>
                {/* Timeline Header */}
                <Row style={{ marginBottom: '16px', paddingRight: '20px' }}>
                  <Col span={6}>
                    <strong>Tâche</strong>
                  </Col>
                  <Col span={18}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Jan</span>
                      <span>Fév</span>
                      <span>Mar</span>
                      <span>Avr</span>
                      <span>Mai</span>
                      <span>Juin</span>
                    </div>
                  </Col>
                </Row>

                {/* Gantt Bars */}
                {taches.map((tache) => {
                  const position = calculerPositionGantt(tache);
                  return (
                    <Row key={tache.id} style={{ marginBottom: '12px', alignItems: 'center', paddingRight: '20px' }}>
                      <Col span={6}>
                        <div style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tache.nom}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          {tache.userstaches?.map(user => user.name).join(', ') || 'Non assigné'}
                        </div>
                      </Col>
                      <Col span={18}>
                        <div style={{
                          position: 'relative',
                          height: '32px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            left: `${position.left}%`,
                            width: `${position.width}%`,
                            height: '100%',
                            backgroundColor: tache.statut === 'termine' ? '#52c41a' :
                                            tache.statut === 'en cours' ? '#1890ff' :
                                            tache.statut === 'bloque' ? '#f5222d' :
                                            tache.statut === 'prevu' ? '#faad14' :
                                            '#d9d9d9',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}>
                            {tache.duree}j
                          </div>
                        </div>
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                          {dayjs(tache.date_debut).format('DD/MM')} - {dayjs(tache.date_fin).format('DD/MM')}
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal for Adding/Editing Task */}
      <Modal
      title={editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
      open={isModalVisible}
      onCancel={handleCancel}
      onOk={() => form.submit()} // 🔥 clé
      width={600}
    >

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >

        <Form.Item
          label="Nom de la tâche"
          name="nom"
          rules={[{ required: true, message: "Nom obligatoire" }]}
        >
          <Input placeholder="Nom de la tâche" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description obligatoire" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Statut"
          name="statut"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="prevu">Prévu</Select.Option>
            <Select.Option value="en cours">En cours</Select.Option>
            <Select.Option value="termine">Terminé</Select.Option>
            <Select.Option value="bloque">Bloqué</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priorité"
          name="priorite"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="eleve">Élevée</Select.Option>
            <Select.Option value="moyenne">Moyenne</Select.Option>
            <Select.Option value="faible">Faible</Select.Option>
          </Select>
        </Form.Item>

        {/* 📅 DATES */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Date début"
              name="date_debut"
              rules={[{ required: true, message: "Date début obligatoire" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleDatesChange}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Date fin"
              name="date_fin"
              dependencies={["date_debut"]}
              rules={[
                { required: true, message: "Date fin obligatoire" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const debut = getFieldValue("date_debut");
                    if (!value || !debut || value.isAfter(debut) || value.isSame(debut)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Date fin doit être après début");
                  }
                })
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                onChange={handleDatesChange}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* ⏱ DURÉE AUTO */}
        <Form.Item
          label="Durée (jours)"
          name="duree"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item name="projet_id" hidden>
          <Input />
        </Form.Item>

      </Form>

    </Modal>
    </div>
  );
};

export default GestionTachesProjets;
