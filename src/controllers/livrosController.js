import Livro from '../models/livro.js';

class LivrosController {
  static listarLivros = async (_, res) => {
    try {
      const resultado = await Livro.pegarLivros();
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static listarLivroPorId = async (req, res) => {
    const { params } = req;
    try {
      const resultado = await Livro.pegarPeloId(params.id);
      return res.status(200).json(resultado);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static cadastrarLivro = async (req, res) => {
    const { body } = req;
    const livro = new Livro(body);
    try {
      // validação se o body estiver vazio 
      if (Object.keys(body).length === 0) {
        throw new Error('corpo da requisicao vaio');
      }
      const resposta = await livro.salvar(livro);
      return res.status(201).json({ message: 'livro criado', content: resposta });
    } catch (err) {
      // checando se a menssagem de erro e igual a mensagem de validação do body vazio
      if (err.message === 'corpo da requisicao vaio') {
        return res.status(400).json(err.message);
      }
      return res.status(500).json(err.message);
    }
  };

  static atualizarLivro = async (req, res) => {
    const { params } = req;
    const { body } = req;
    try {
      const livroAtual = await Livro.pegarPeloId(params.id);
      const novoLivro = new Livro({ ...livroAtual, ...body });
      const resposta = await novoLivro.salvar(novoLivro);
      return res.status(204).json({ message: 'livro atualizado', content: resposta });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };

  static excluirLivro = async (req, res) => {
    const { params } = req;
    try {
      await Livro.excluir(params.id);
      return res.status(200).json({ message: 'livro excluído' });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  };
}

export default LivrosController;
