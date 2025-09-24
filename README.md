# E2E-Commerce - Sistema de Gestão de Usuários e Produtos

Sistema web responsivo desenvolvido com HTML, CSS e JavaScript puro para gestão de usuários e produtos de um e-commerce.

## 🚀 Funcionalidades

### Módulo de Gestão de Usuários
- ✅ Cadastro de usuários com validação completa
- ✅ Login com autenticação segura
- ✅ Diferentes perfis (Cliente, Vendedor, Administrador)
- ✅ Edição de dados pessoais
- ✅ Exclusão de usuários com confirmação
- ✅ Logout automático após 30 minutos de inatividade
- ✅ Validação de senha (mínimo 10 caracteres com letras, números e caracteres especiais)
- ✅ Validação de e-mail único

### Módulo de Gestão de Produtos
- ✅ Listagem paginada de produtos
- ✅ Busca por nome do produto
- ✅ Filtro por categoria
- ✅ Ordenação por preço, nome e estoque
- ✅ Aumento de estoque em lotes de 10 unidades
- ✅ Validação de produtos inativos
- ✅ Confirmação antes de alterar estoque
- ✅ Interface responsiva para dispositivos móveis

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos e animações
- **JavaScript ES6+** - Lógica da aplicação
- **LocalStorage** - Persistência de dados
- **Google Fonts** - Tipografia (Inter)

## 📱 Design Responsivo

O sistema foi desenvolvido com abordagem mobile-first e é totalmente responsivo:

- **Desktop** (> 768px): Layout em grid com múltiplas colunas
- **Tablet** (768px): Layout adaptado com 2 colunas
- **Mobile** (< 768px): Layout em coluna única

## 🔐 Segurança

- Senhas armazenadas com criptografia Base64 (simulação)
- Validação de sessão com timeout automático
- Controle de acesso baseado em perfis
- Validação de entrada em todos os formulários

## 🎨 Interface

- Design moderno e profissional
- Cores harmoniosas com gradientes
- Animações suaves e feedback visual
- Modais para confirmações e formulários
- Mensagens de sucesso/erro contextuais
- Loading spinner para operações assíncronas

## 📋 Como Usar

1. **Acesso Inicial**: Abra o arquivo `index.html` no navegador
2. **Login Administrador**: Use `admin@e2e.com` / `Admin123!@#`
3. **Cadastro**: Clique em "Login" → "Cadastre-se aqui"
4. **Gestão de Usuários**: Apenas administradores podem acessar
5. **Gestão de Produtos**: Todos os usuários logados podem acessar

## 🔧 Estrutura do Projeto

```
E2E-Commerce/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Documentação
```

## ✨ Características Técnicas

### Validações Implementadas
- E-mail único no sistema
- Senha com critérios de segurança
- Validação de formulários em tempo real
- Verificação de produtos inativos
- Confirmação de ações destrutivas

### Funcionalidades Avançadas
- Paginação inteligente
- Filtros combinados (busca + categoria + ordenação)
- Timer de inatividade com reset automático
- Persistência de dados no localStorage
- Interface adaptativa por perfil de usuário

### Responsividade
- Breakpoints: 768px (tablet) e 480px (mobile)
- Grid responsivo para produtos
- Modais adaptáveis
- Navegação otimizada para touch

## 🎯 Critérios de Aceite Atendidos

### Gestão de Usuários
- ✅ Cadastro com dados obrigatórios validados
- ✅ E-mail único no sistema
- ✅ Senha com critérios de segurança
- ✅ Login com credenciais corretas
- ✅ Perfis com permissões distintas
- ✅ Edição apenas de dados permitidos
- ✅ Logout automático funcional

### Gestão de Produtos
- ✅ Lista paginada com informações completas
- ✅ Busca e filtros funcionais
- ✅ Detalhes de produto com estoque atual
- ✅ Acréscimo em lotes de 10 unidades
- ✅ Validação de múltiplos de 10
- ✅ Confirmação antes de aplicar alterações
- ✅ Mensagens de erro contextuais
- ✅ Bloqueio para produtos inativos

## 🚀 Próximos Passos

Para expandir o sistema, considere:
- Integração com API backend
- Criptografia real de senhas
- Upload de imagens de produtos
- Relatórios e dashboards avançados
- Notificações em tempo real
- Testes automatizados

---

**Desenvolvido com ❤️ usando apenas HTML, CSS e JavaScript puro**
