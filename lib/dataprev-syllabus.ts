export interface SyllabusTopic {
  id: string;
  code: string;
  disciplineId: string;
  disciplineName: string;
  title: string;
  subtopics: string[];
  keyTopics: string[];
  importance: 'Alta' | 'Média' | 'Normal';
  description: string;
}

export interface Discipline {
  id: string;
  name: string;
  shortName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  topics: SyllabusTopic[];
}

export const DATAPREV_SYLLABUS: Discipline[] = [
  {
    id: 'PORTUGUES',
    name: 'Língua Portuguesa',
    shortName: 'Português',
    color: 'indigo',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    description: 'Compreensão de textos, gramática, sintaxe, coesão, regência, crase e redação oficial.',
    topics: [
      {
        id: 'port-1',
        code: 'PORT.1',
        disciplineId: 'PORTUGUES',
        disciplineName: 'Língua Portuguesa',
        title: 'Compreensão e Interpretação de Textos',
        subtopics: [
          'Leitura, interpretação e inferências textuais',
          'Tipologia textual (narrativo, descritivo, dissertativo, injuntivo)',
          'Gêneros textuais e coesão/coerência textual',
          'Significação de palavras (sinonímia, antonímia, hiperonímia, conotação e denotação)'
        ],
        keyTopics: ['Interpretação', 'Tipologia Textual', 'Coesão', 'Coerência', 'Denotação', 'Conotação'],
        importance: 'Alta',
        description: 'Capacidade de analisar, sintetizar e inferir sentidos em textos diversos cobrados por bancas de concurso.'
      },
      {
        id: 'port-2',
        code: 'PORT.2',
        disciplineId: 'PORTUGUES',
        disciplineName: 'Língua Portuguesa',
        title: 'Gramática, Ortografia e Acentuação',
        subtopics: [
          'Novo Acordo Ortográfico e acentuação gráfica',
          'Morfologia: classes de palavras (substantivo, adjetivo, pronome, verbo, advérbio, preposição, conjunção)',
          'Emprego de pronomes demonstrativos, relativos e colocação pronominal (próclise, mesóclise, ênclise)'
        ],
        keyTopics: ['Acentuação', 'Morfologia', 'Pronomes', 'Colocação Pronominal', 'Classes de Palavras'],
        importance: 'Alta',
        description: 'Morfologia aplicada, emprego correto de pronomes e regras gramaticais vigentes.'
      },
      {
        id: 'port-3',
        code: 'PORT.3',
        disciplineId: 'PORTUGUES',
        disciplineName: 'Língua Portuguesa',
        title: 'Sintaxe, Regência, Concordância e Crase',
        subtopics: [
          'Sintaxe do período simples e composto (coordenação e subordinação)',
          'Concordância verbal e nominal',
          'Regência verbal e nominal',
          'Emprego do sinal indicativo de crase',
          'Pontuação (uso da vírgula, dois-pontos, travessão)'
        ],
        keyTopics: ['Sintaxe', 'Concordância', 'Regência', 'Crase', 'Pontuação', 'Vírgula'],
        importance: 'Alta',
        description: 'Relações sintáticas entre termos, regras de crase e pontuação exigidas pelas bancas.'
      },
      {
        id: 'port-4',
        code: 'PORT.4',
        disciplineId: 'PORTUGUES',
        disciplineName: 'Língua Portuguesa',
        title: 'Redação Oficial & Manual da Presidência da República',
        subtopics: [
          'Aspectos gerais da redação oficial (imparcialidade, clareza, concisão, formalidade)',
          'Estrutura de documentos formais (Ofício, Mémorando, Correio Eletrônico)',
          'Pronomes de tratamento e fechos oficiais'
        ],
        keyTopics: ['Redação Oficial', 'Ofício', 'Pronomes de Tratamento', 'Manual da Presidência'],
        importance: 'Média',
        description: 'Normas de correspondência e padronização dos atos administrativos no serviço público.'
      }
    ]
  },
  {
    id: 'RACIOCINIO_LOGICO',
    name: 'Raciocínio Lógico-Matemático',
    shortName: 'Raciocínio Lógico',
    color: 'cyan',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeText: 'text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    description: 'Lógica proposicional, tabelas-verdade, equivalências, argumentos, probabilidade e conjuntos.',
    topics: [
      {
        id: 'rlm-1',
        code: 'RLM.1',
        disciplineId: 'RACIOCINIO_LOGICO',
        disciplineName: 'Raciocínio Lógico-Matemático',
        title: 'Lógica Proposicional, Tabela-Verdade e Operadores',
        subtopics: [
          'Proposições simples e compostas',
          'Conectivos lógicos (E, OU, SE...ENTÃO, SE E SOMENTE SE, OU...OU)',
          'Construção de Tabelas-Verdade',
          'Tautologia, Contradição e Contingência'
        ],
        keyTopics: ['Proposições', 'Conectivos', 'Tabela-Verdade', 'Tautologia', 'Contradição'],
        importance: 'Alta',
        description: 'Estruturação do raciocínio formal e cálculo do valor lógico de proposições.'
      },
      {
        id: 'rlm-2',
        code: 'RLM.2',
        disciplineId: 'RACIOCINIO_LOGICO',
        disciplineName: 'Raciocínio Lógico-Matemático',
        title: 'Equivalências Lógicas & Leis de De Morgan',
        subtopics: [
          'Equivalência do condicional (p → q ≡ ~q → ~p e p → q ≡ ~p v q)',
          'Negação de proposições compostas (Leis de De Morgan)',
          'Negação de quantificadores (Todo, Algum, Nenhum)'
        ],
        keyTopics: ['Equivalências', 'Contrapositiva', 'Leis de De Morgan', 'Quantificadores'],
        importance: 'Alta',
        description: 'Transformações equivalentes e técnicas de negação lógica muito recorrentes em provas.'
      },
      {
        id: 'rlm-3',
        code: 'RLM.3',
        disciplineId: 'RACIOCINIO_LOGICO',
        disciplineName: 'Raciocínio Lógico-Matemático',
        title: 'Teoria dos Conjuntos, Análise Combinatória e Probabilidade',
        subtopics: [
          'Diagramas de Venn e operações com conjuntos (União, Interseção, Diferença)',
          'Princípio Fundamental da Contagem (PFC), Arranjos, Permutações e Combinações',
          'Probabilidade simples e condicional'
        ],
        keyTopics: ['Conjuntos', 'Venn', 'Combinatória', 'Permutação', 'Combinação', 'Probabilidade'],
        importance: 'Alta',
        description: 'Resolução de problemas com conjuntos, contagem combinatória e cálculo de probabilidades.'
      }
    ]
  },
  {
    id: 'LEGISLACAO',
    name: 'Legislação, Ética & Direito Público',
    shortName: 'Legislação & Ética',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeText: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: 'LGPD, LAI, Constituição Federal, Ética Pública e Legislação das Estatais.',
    topics: [
      {
        id: 'leg-1',
        code: 'LEG.1',
        disciplineId: 'LEGISLACAO',
        disciplineName: 'Legislação, Ética & Direito Público',
        title: 'LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)',
        subtopics: [
          'Conceitos: dado pessoal, dado sensível, tratamento, controlador, operador, encarregado (DPO)',
          'Bases legais para tratamento de dados pessoais',
          'Direitos dos titulares de dados',
          'Sanções administrativas e atuação da ANPD'
        ],
        keyTopics: ['LGPD', 'Dados Pessoais', 'Bases Legais', 'DPO', 'ANPD', 'Direitos do Titular'],
        importance: 'Alta',
        description: 'Disposições e impactos da LGPD no desenvolvimento e governança de sistemas públicos.'
      },
      {
        id: 'leg-2',
        code: 'LEG.2',
        disciplineId: 'LEGISLACAO',
        disciplineName: 'Legislação, Ética & Direito Público',
        title: 'Lei de Acesso à Informação (LAI - Lei 12.527/2011) & Ética',
        subtopics: [
          'Direito fundamental de acesso a informações públicas',
          'Transparência ativa e passiva',
          'Classificação de informação quanto ao grau de sigilo (Reservada, Secreta, Ultrassecreta)',
          'Código de Ética Profissional do Servidor Público Civil do Executivo Federal (Decreto 1.171/1994)'
        ],
        keyTopics: ['LAI', 'Acesso à Informação', 'Transparência', 'Grau de Sigilo', 'Ética Pública'],
        importance: 'Alta',
        description: 'Transparência pública, graus de sigilo e princípios éticos na administração.'
      },
      {
        id: 'leg-3',
        code: 'LEG.3',
        disciplineId: 'LEGISLACAO',
        disciplineName: 'Legislação, Ética & Direito Público',
        title: 'Constituição Federal & Administração Pública (Art. 37 a 41)',
        subtopics: [
          'Princípios expressos (LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência)',
          'Cargos, empregos e funções públicas, concurso público, estabilidade',
          'Acumulação de cargos e responsabilidade civil do Estado'
        ],
        keyTopics: ['LIMPE', 'Artigo 37', 'Concurso Público', 'Responsabilidade Civil', 'Direito Constitucional'],
        importance: 'Alta',
        description: 'Disposições constitucionais sobre agentes públicos, concursos e administração federal.'
      }
    ]
  },
  {
    id: 'INGLES',
    name: 'Língua Inglesa Técnica',
    shortName: 'Inglês Técnico',
    color: 'teal',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeText: 'text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    description: 'Compreensão de artigos e manuais técnicos de TI, vocabulário e tradução funcional.',
    topics: [
      {
        id: 'ing-1',
        code: 'ING.1',
        disciplineId: 'INGLES',
        disciplineName: 'Língua Inglesa Técnica',
        title: 'Leitura e Compreensão de Documentação Técnica em Inglês',
        subtopics: [
          'Estratégias de Leitura (Skimming e Scanning)',
          'Vocabulário técnico de TI (Software Engineering, Cloud, Security, AI)',
          'Falsos cognatos e conectivos textuais em inglês'
        ],
        keyTopics: ['Technical Reading', 'Skimming', 'Scanning', 'TI Vocabulary', 'False Friends'],
        importance: 'Média',
        description: 'Interpretação de manuais, documentação de APIs e artigos técnicos em inglês.'
      }
    ]
  },
  {
    id: 'DESENVOLVIMENTO_SISTEMAS',
    name: 'Desenvolvimento de Sistemas',
    shortName: 'Dev. Sistemas',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: 'Linguagens (Java, JS, Frameworks), Arquitetura, Testes, Engenharia de Requisitos, Frontend e DevOps.',
    topics: [
      {
        id: 'ds-1',
        code: 'DS.1',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Linguagens e Frameworks Backend & Mobile',
        subtopics: [
          'Java (v6 ou superior), JavaEE (v6+) e JakartaEE',
          'JPA (v2 ou superior) & Hibernate',
          'Javascript ES6+',
          'JUnit & Frameworks de Testes Unitários',
          'JSF e Primefaces',
          'Spring Framework, Spring Boot e Spring Cloud',
          'Desenvolvimento Mobile (Android e iOS)',
          'Ferramentas Low-code e No-code'
        ],
        keyTopics: ['Java', 'Spring Boot', 'Spring Cloud', 'JPA', 'Hibernate', 'JUnit', 'JSF', 'Primefaces', 'Mobile', 'Android', 'iOS', 'Low-Code'],
        importance: 'Alta',
        description: 'Desenvolvimento em linguagens e ecossistemas corporativos Java, JS e soluções mobile e low-code.'
      },
      {
        id: 'ds-2',
        code: 'DS.2',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Análise Estática de Código Fonte',
        subtopics: [
          'Princípios de Clean Code (Código Limpo)',
          'Ferramenta SonarQube (regras, métricas, débito técnico)',
          'Code Smells e Refatoração'
        ],
        keyTopics: ['Clean Code', 'SonarQube', 'Análise Estática', 'Refatoração'],
        importance: 'Alta',
        description: 'Boas práticas de codificação limpa e uso de ferramentas de análise estática de código.'
      },
      {
        id: 'ds-3',
        code: 'DS.3',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Arquitetura de Software e Interoperabilidade',
        subtopics: [
          'Interoperabilidade de Sistemas',
          'Arquitetura Orientada a Serviços (SOA) e Web Services',
          'Mensageria e Filas de Mensagens',
          'Design e Documentação de APIs (REST, OpenAPI / Swagger)',
          'Arquitetura Orientada a Objetos (POO)',
          'Arquitetura para Ambientes Web e Servidores de Aplicação/Web'
        ],
        keyTopics: ['SOA', 'Web Services', 'Mensageria', 'REST', 'Swagger', 'OpenAPI', 'POO', 'Servidores Web'],
        importance: 'Alta',
        description: 'Conceitos de arquitetura orientada a serviços, comunicação entre sistemas e APIs.'
      },
      {
        id: 'ds-4',
        code: 'DS.4',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Ambientes Web, Intranet, Extranet e Portais',
        subtopics: [
          'Internet, Extranet, Intranet e Portais Corporativos',
          'Finalidades, Características Físicas e Lógicas',
          'Aplicações e Serviços de Rede Corporativa'
        ],
        keyTopics: ['Internet', 'Intranet', 'Extranet', 'Portais'],
        importance: 'Média',
        description: 'Definições, estruturas físicas/lógicas e serviços de ambientes web e redes corporativas.'
      },
      {
        id: 'ds-5',
        code: 'DS.5',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Padrões de Troca de Dados Web',
        subtopics: [
          'XML e Schemas',
          'XSLT e Transformações XML',
          'UDDI e REST',
          'JSON e Estruturas de Dados'
        ],
        keyTopics: ['XML', 'XSLT', 'UDDI', 'REST', 'JSON'],
        importance: 'Média',
        description: 'Formatos de serialização e protocolos para troca de informações entre aplicações.'
      },
      {
        id: 'ds-6',
        code: 'DS.6',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'DevOps e Integração Contínua',
        subtopics: [
          'Cultura DevOps e Integração/Entrega Contínua (CI/CD)',
          'Pipelines de Automação',
          'Cultura de Colaboração e Monitoramento'
        ],
        keyTopics: ['DevOps', 'CI/CD', 'Pipeline', 'Automação'],
        importance: 'Alta',
        description: 'Práticas de DevOps, esteiras de integração contínua e automação de deploys.'
      },
      {
        id: 'ds-7',
        code: 'DS.7',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Gestão de Configuração e Controle de Versão (GIT)',
        subtopics: [
          'Ferramenta GIT (Comandos, Branching, Merging, Rebase)',
          'Fluxos de trabalho (GitFlow, Trunk-Based)',
          'Controle de Versões e Resolução de Conflitos'
        ],
        keyTopics: ['GIT', 'GitFlow', 'Branching', 'Merge', 'Commit'],
        importance: 'Alta',
        description: 'Gerenciamento de versão e controle de código-fonte corporativo com GIT.'
      },
      {
        id: 'ds-8',
        code: 'DS.8',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Testes de Software & RPA',
        subtopics: [
          'Conceitos Básicos de Testes de Aplicações',
          'Testes Unitários e Testes de Integração',
          'Testes Ágeis e Teste de Usabilidade de Software',
          'Testes Automatizados e Tipos de Teste (Funcional, Regressão, Carga)',
          'Test-Driven Development (TDD)',
          'Gestão do Ciclo de Vida de Testes',
          'RPA (Robotic Process Automation)'
        ],
        keyTopics: ['Testes Unitários', 'TDD', 'Testes Automatizados', 'RPA', 'Usabilidade', 'Ciclo de Vida de Testes'],
        importance: 'Alta',
        description: 'Estratégias de testes, desenvolvimento guiado a testes e automação de processos robóticos.'
      },
      {
        id: 'ds-9',
        code: 'DS.9',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Metodologias Ágeis de Desenvolvimento',
        subtopics: [
          'Scrum (Papéis, Cerimônias, Artefatos)',
          'Kanban (Fluxo, WIP, Quadro)',
          'XP (eXtreme Programming - Par Programming, Refactoring, CI)'
        ],
        keyTopics: ['Scrum', 'Kanban', 'XP', 'Agile', 'Sprint'],
        importance: 'Alta',
        description: 'Frameworks e metodologias ágeis de desenvolvimento de software.'
      },
      {
        id: 'ds-10',
        code: 'DS.10',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Padrões de Desenvolvimento, Reuso e Codificação',
        subtopics: [
          'Padrões de Projeto (Design Patterns GoF)',
          'Padrões de Reuso e Arquitetura',
          'Codificação de Software Transacional, Analítico, Mobile e API'
        ],
        keyTopics: ['Design Patterns', 'GoF', 'Reuso', 'Codificação', 'Transacional', 'API'],
        importance: 'Média',
        description: 'Boas práticas de reutilização de componentes e padrões arquiteturais.'
      },
      {
        id: 'ds-11',
        code: 'DS.11',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Métricas de Software: Pontos de Função e Story Points',
        subtopics: [
          'Metodologia de Análise de Ponto de Função (APF - IFPUG)',
          'Tipos de Função de Dados (ALI, AIE) e Transação (EE, SE, CE)',
          'Estimativa ágil com Story Points e Planning Poker'
        ],
        keyTopics: ['Ponto de Função', 'APF', 'IFPUG', 'Story Points', 'Estimativas'],
        importance: 'Alta',
        description: 'Técnicas de medição e estimativa do tamanho funcional e esforço de projetos.'
      },
      {
        id: 'ds-12',
        code: 'DS.12',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Engenharia de Requisitos',
        subtopics: [
          'Classificação de Requisitos (Funcionais, Não-Funcionais, Regras de Negócio)',
          'Processo de Engenharia de Requisitos',
          'Técnicas de Elicitação de Requisitos (Entrevistas, Workshops, Prototipação, Casos de Uso, Histórias de Usuário)'
        ],
        keyTopics: ['Requisitos Funcionais', 'Requisitos Não-Funcionais', 'Elicitação', 'User Stories', 'Casos de Uso'],
        importance: 'Alta',
        description: 'Levantamento, análise, documentação e validação de requisitos de software.'
      },
      {
        id: 'ds-13',
        code: 'DS.13',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Tecnologias e Práticas Frontend Web',
        subtopics: [
          'HTML5, CSS3 e Estilização Responsiva',
          'UX / UI e Ajax',
          'Frameworks Modernos: React, VueJS e Angular',
          'Padrões de Frontend Web',
          'SPA (Single Page Applications) e PWA (Progressive Web Apps)'
        ],
        keyTopics: ['HTML5', 'CSS3', 'React', 'VueJS', 'Angular', 'SPA', 'PWA', 'Ajax'],
        importance: 'Alta',
        description: 'Construção de interfaces web modernas, arquitetura SPA/PWA e frameworks JS.'
      },
      {
        id: 'ds-14',
        code: 'DS.14',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Protocolos Seguros e Criptografia Web',
        subtopics: [
          'Protocolo HTTPS',
          'Camadas de Segurança SSL / TLS',
          'Certificados Digitais e Criptografia em Trânsito'
        ],
        keyTopics: ['HTTPS', 'SSL', 'TLS', 'Certificado Digital'],
        importance: 'Média',
        description: 'Protocolos de comunicação segura para tráfego web e troca de dados.'
      },
      {
        id: 'ds-15',
        code: 'DS.15',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Blockchain & Design de Software',
        subtopics: [
          'Conceitos Básicos de Blockchain, DLT e Contratos Inteligentes',
          'Princípios de Design de Software'
        ],
        keyTopics: ['Blockchain', 'DLT', 'Design de Software'],
        importance: 'Normal',
        description: 'Tecnologia de registro distribuído e princípios modernos de design de software.'
      },
      {
        id: 'ds-16',
        code: 'DS.16',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Arquitetura Hexagonal, Microsserviços e Containers',
        subtopics: [
          'Arquitetura Hexagonal (Ports and Adapters)',
          'Microsserviços: Orquestração de Serviços e API Gateway',
          'Containers (Docker e Kubernetes)'
        ],
        keyTopics: ['Arquitetura Hexagonal', 'Microsserviços', 'API Gateway', 'Containers', 'Docker', 'Kubernetes'],
        importance: 'Alta',
        description: 'Arquiteturas descentralizadas, padrão de portas e adaptadores, microsserviços e contêineres.'
      },
      {
        id: 'ds-17',
        code: 'DS.17',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Transações Distribuídas & Sistemas de Gestão de Conteúdo (CMS)',
        subtopics: [
          'Transações Distribuídas (Padrão Saga, 2PC)',
          'User Experience (UX)',
          'Sistemas de Gestão de Conteúdo (CMS): Conceitos e Aplicações',
          'Arquitetura de Informação e Portais Corporativos',
          'Workflow, Conceitos de Acessibilidade (e-MAG / WCAG) e Usabilidade',
          'Desenho e Planejamento de Interação em Aplicações Web'
        ],
        keyTopics: ['Transações Distribuídas', 'CMS', 'UX', 'Arquitetura de Informação', 'Workflow', 'Acessibilidade', 'WCAG'],
        importance: 'Média',
        description: 'Gerenciamento de transações entre microsserviços e portais corporativos acessíveis.'
      },
      {
        id: 'ds-18',
        code: 'DS.18',
        disciplineId: 'DESENVOLVIMENTO_SISTEMAS',
        disciplineName: 'Desenvolvimento de Sistemas',
        title: 'Inteligência Artificial, Análise de Dados e Big Data',
        subtopics: [
          'Conceitos Básicos de Inteligência Artificial (IA)',
          'Análise de Dados e Engenharia de Prompt/Modelos',
          'Conceitos Fundamentais de Big Data (Volume, Variedade, Velocidade)'
        ],
        keyTopics: ['Inteligência Artificial', 'Análise de Dados', 'Big Data', 'IA'],
        importance: 'Média',
        description: 'Fundamentos de IA, analytics e processamento de grandes volumes de dados.'
      }
    ]
  },
  {
    id: 'BI',
    name: 'Inteligência de Negócios (Business Intelligence)',
    shortName: 'Business Intelligence',
    color: 'blue',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: 'Data Warehouse, ETL, OLAP, Data Mining e Visualização de Dados.',
    topics: [
      {
        id: 'bi-1',
        code: 'BI.1',
        disciplineId: 'BI',
        disciplineName: 'Inteligência de Negócios (BI)',
        title: 'Fundamentos e Conceitos de Business Intelligence',
        subtopics: [
          'Conceitos, Fundamentos, Características, Técnicas e Métodos de BI',
          'Sistemas de Suporte à Decisão (SAD) e Gestão de Conteúdo',
          'Arquitetura Geral de Business Intelligence'
        ],
        keyTopics: ['Business Intelligence', 'SAD', 'Suporte à Decisão', 'Arquitetura BI'],
        importance: 'Alta',
        description: 'Visão geral do papel estratégico da informação e componentes de ecossistemas BI.'
      },
      {
        id: 'bi-2',
        code: 'BI.2',
        disciplineId: 'BI',
        disciplineName: 'Inteligência de Negócios (BI)',
        title: 'Data Warehouse, ETL e Processamento OLAP',
        subtopics: [
          'Arquitetura e Aplicações de Data Warehouse',
          'Processos de Extração, Transformação e Carga (ETL)',
          'Processamento Analítico em Tempo Real (OLAP: ROLAP, MOLAP, HOLAP)'
        ],
        keyTopics: ['Data Warehouse', 'ETL', 'OLAP', 'MOLAP', 'ROLAP'],
        importance: 'Alta',
        description: 'Modelagem e sustentação de armazéns de dados analíticos com suporte OLAP e ETL.'
      },
      {
        id: 'bi-3',
        code: 'BI.3',
        disciplineId: 'BI',
        disciplineName: 'Inteligência de Negócios (BI)',
        title: 'Data Mining e Visualização de Dados',
        subtopics: [
          'Definições e Conceitos de Data Mining (Mineração de Dados)',
          'Técnicas de Mineração (Classificação, Agrupamento, Regras de Associação)',
          'Visualização de Dados: BD Individuais e Cubos Multidimensionais',
          'Mapeamento das Fontes de Dados e Técnicas para Coleta de Dados'
        ],
        keyTopics: ['Data Mining', 'Visualização de Dados', 'Cubos', 'Coleta de Dados'],
        importance: 'Alta',
        description: 'Descoberta de conhecimento em bases de dados e representação visual gráfica.'
      }
    ]
  },
  {
    id: 'SEGURANCA',
    name: 'Segurança da Informação',
    shortName: 'Segurança da Informação',
    color: 'rose',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeText: 'text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    description: 'ISO 27001/27002, Tríade CID, OAuth2/SSO, OWASP Top 10, SAST/DAST e Gestão de Riscos.',
    topics: [
      {
        id: 'seg-1',
        code: 'SEG.1',
        disciplineId: 'SEGURANCA',
        disciplineName: 'Segurança da Informação',
        title: 'Políticas, Procedimentos e Gestão da Segurança',
        subtopics: [
          'Políticas de Segurança da Informação (PSI)',
          'Procedimentos de Segurança e Conceitos Gerais de Gerenciamento',
          'Gestão da Segurança Corporativa'
        ],
        keyTopics: ['PSI', 'Política de Segurança', 'Procedimentos de Segurança'],
        importance: 'Alta',
        description: 'Diretrizes organizacionais e gestão corporativa de segurança da informação.'
      },
      {
        id: 'seg-2',
        code: 'SEG.2',
        disciplineId: 'SEGURANCA',
        disciplineName: 'Segurança da Informação',
        title: 'Normas ABNT ISO/IEC 27001:2022 e 27002:2022',
        subtopics: [
          'Norma ABNT NBR ISO/IEC 27001:2022 (Requisitos do SGSI)',
          'Norma ABNT NBR ISO/IEC 27002:2022 (Controles de Segurança e Controles Temáticos)'
        ],
        keyTopics: ['ISO 27001', 'ISO 27002', 'SGSI', 'Controles de Segurança'],
        importance: 'Alta',
        description: 'Padrões internacionais para Sistema de Gestão de Segurança da Informação.'
      },
      {
        id: 'seg-3',
        code: 'SEG.3',
        disciplineId: 'SEGURANCA',
        disciplineName: 'Segurança da Informação',
        title: 'Tríade de Segurança & Mecanismos de Controle de Acesso',
        subtopics: [
          'Confiabilidade (Confidencialidade), Integridade e Disponibilidade (Tríade CID)',
          'Mecanismos de Segurança e Controle de Acesso (RBAC, ABAC)',
          'Protocolo OAuth2 e Single Sign-On (SSO)'
        ],
        keyTopics: ['Tríade CID', 'Controle de Acesso', 'OAuth2', 'SSO', 'Autenticação'],
        importance: 'Alta',
        description: 'Princípios fundamentais de segurança e soluções modernas de identidade e autorização.'
      },
      {
        id: 'seg-4',
        code: 'SEG.4',
        disciplineId: 'SEGURANCA',
        disciplineName: 'Segurança da Informação',
        title: 'Gerência de Riscos, Desenvolvimento Seguro e OWASP',
        subtopics: [
          'Gerência de Riscos de Segurança (Ameaça, Vulnerabilidade e Impacto)',
          'Ciclo de Vida de Desenvolvimento Seguro (SDL – Security Development Lifecycle)',
          'OWASP Top 10 (Vulnerabilidades Web Críticas)',
          'Análise Estática e Dinâmica de Código de Segurança (SAST e DAST)'
        ],
        keyTopics: ['Gerência de Riscos', 'SDL', 'OWASP Top 10', 'SAST', 'DAST', 'Vulnerabilidades'],
        importance: 'Alta',
        description: 'Identificação de ameaças, desenvolvimento de software resistente e testes SAST/DAST.'
      }
    ]
  },
  {
    id: 'BANCO_DADOS',
    name: 'Banco de Dados',
    shortName: 'Banco de Dados',
    color: 'amber',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: 'Modelagem, Normalização, SQL (DDL/DML), NoSQL, Data Lakes, Ingestão e Integração.',
    topics: [
      {
        id: 'bd-1',
        code: 'BD.1',
        disciplineId: 'BANCO_DADOS',
        disciplineName: 'Banco de Dados',
        title: 'Modelagem de Dados e Normalização',
        subtopics: [
          'Modelagem de Dados (Conceitual, Lógica e Física)',
          'Abordagem Relacional e Multidimensional',
          'Normalização das Estruturas de Dados (1FN, 2FN, 3FN, BCNF)',
          'Integridade Referencial e Metadados',
          'Modelagem Dimensional (Esquema Estrela e Floco de Neve)'
        ],
        keyTopics: ['Modelagem Conceitual', 'Modelagem Lógica', 'Normalização', 'Integridade Referencial', 'Esquema Estrela'],
        importance: 'Alta',
        description: 'Projeto de banco de dados, regras de integridade e eliminação de redundâncias.'
      },
      {
        id: 'bd-2',
        code: 'BD.2',
        disciplineId: 'BANCO_DADOS',
        disciplineName: 'Banco de Dados',
        title: 'Linguagem SQL (DDL e DML) e SGBD',
        subtopics: [
          'Linguagem de Consulta Estruturada (SQL)',
          'Linguagem de Definição de Dados (DDL: CREATE, ALTER, DROP)',
          'Linguagem de Manipulação de Dados (DML: INSERT, UPDATE, DELETE, SELECT)',
          'Sistemas Gerenciadores de Banco de Dados (SGBD)',
          'Propriedades ACID das Transações de Banco de Dados'
        ],
        keyTopics: ['SQL', 'DDL', 'DML', 'SGBD', 'ACID', 'Transações'],
        importance: 'Alta',
        description: 'Consultas e comandos SQL para manipulação e estruturação de bases relacionais.'
      },
      {
        id: 'bd-3',
        code: 'BD.3',
        disciplineId: 'BANCO_DADOS',
        disciplineName: 'Banco de Dados',
        title: 'NoSQL, In-Memory, Big Data e Ingestão de Dados',
        subtopics: [
          'Bancos de Dados NoSQL (Chave-Valor, Documentos, Colunar, Grafos)',
          'Bancos de Dados em Memória (In-Memory Databases)',
          'Data Lakes e Soluções para Big Data',
          'Dados Estruturados e Não Estruturados',
          'Avaliação de Modelos de Dados',
          'Técnicas de Integração e Ingestão de Dados (ETL/ELT, Transferência de Arquivos, Integração via BD)'
        ],
        keyTopics: ['NoSQL', 'In-Memory', 'Data Lake', 'Dados Não Estruturados', 'ETL/ELT', 'Ingestão'],
        importance: 'Alta',
        description: 'Bancos não relacionais, arquiteturas de Data Lake e pipelines de ingestão de dados.'
      }
    ]
  },
  {
    id: 'GESTAO_TI',
    name: 'Gestão e Governança de TI',
    shortName: 'Gestão de TI',
    color: 'purple',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    description: 'Gestão de Projetos (PMBOK/Scrum/Kanban), ITIL v4, COBIT 2019 e Modelagem BPMN.',
    topics: [
      {
        id: 'gov-1',
        code: 'GOV.1',
        disciplineId: 'GESTAO_TI',
        disciplineName: 'Gestão e Governança de TI',
        title: 'Gerenciamento de Projetos e Riscos',
        subtopics: [
          'Gerenciamento de Projetos: Conceitos, Áreas de Conhecimento, Projetos, Programas e Portfólio',
          'Abordagens de Projetos: Tradicional, Híbrida e Ágil (Scrum, Lean, Kanban)',
          'Guia Scrum de Prática Ágil',
          'Processos, Grupos de Processos e Áreas de Conhecimento',
          'Gestão de Riscos de Projetos'
        ],
        keyTopics: ['Gerenciamento de Projetos', 'Portfólio', 'PMBOK', 'Scrum', 'Kanban', 'Gestão de Riscos'],
        importance: 'Alta',
        description: 'Frameworks e práticas para planejamento, execução e controle de projetos de TI.'
      },
      {
        id: 'gov-2',
        code: 'GOV.2',
        disciplineId: 'GESTAO_TI',
        disciplineName: 'Gestão e Governança de TI',
        title: 'Gerenciamento de Serviços de TI (ITIL v4)',
        subtopics: [
          'ITIL v4: Conceitos Básicos, Disciplinas, Estrutura e Objetivos',
          'Sistema de Valor de Serviço (SVS)',
          'Cadeia de Valor de Serviço e Práticas de Gerenciamento'
        ],
        keyTopics: ['ITIL v4', 'SVS', 'Cadeia de Valor', 'Gerenciamento de Serviços'],
        importance: 'Alta',
        description: 'Práticas do framework ITIL v4 para prestação e entrega de serviços de tecnologia.'
      },
      {
        id: 'gov-3',
        code: 'GOV.3',
        disciplineId: 'GESTAO_TI',
        disciplineName: 'Gestão e Governança de TI',
        title: 'Governança de TI (COBIT 2019) & BPMN',
        subtopics: [
          'COBIT 2019: Conceitos Básicos, Estrutura e Objetivos',
          'Princípios do COBIT 2019 e Objetivos de Governança/Gerenciamento',
          'Conceitos de Gestão de Processos e Modelagem com BPMN (Business Process Model and Notation)'
        ],
        keyTopics: ['COBIT 2019', 'Governança de TI', 'BPMN', 'Modelagem de Processos'],
        importance: 'Alta',
        description: 'Governança corporativa de TI com COBIT 2019 e mapeamento de processos em BPMN.'
      }
    ]
  }
];

export function getAllTopics(): SyllabusTopic[] {
  return DATAPREV_SYLLABUS.flatMap(d => d.topics);
}

export function getTopicById(id: string): SyllabusTopic | undefined {
  return getAllTopics().find(t => t.id === id);
}
