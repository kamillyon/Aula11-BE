// server.js - Servidor Express Completo (Programação Back-End I - Aula 11 - Aluno 11)
require('dotenv').config();
const express = require('express');
const supabase = require('./src/config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3011;

// 1. Rota GET Global: Listar todos os produtos
app.get('/sessoes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessoes_cinema')
      .select('*')
      .order('horario_exibicao', { ascending: true});

    if (error) {
      return res.status(500).json({ erro: 'Erro no banco de dados', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

// 2. Rota GET por ID com tratamento 404
app.get('/sessoes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('sessoes_cinema')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Sessão não encontrada' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha na busca do recurso' });
  }
});

// 3. Rota GET com Ordenação Decrescente por Preço
app.get('/sessoes-ordenadas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessoes_cinema')
      .select('*')
      .order('preco', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao ordenar sessões' });
  }
});

// Inicialização da escuta do servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/sessoes`);
});