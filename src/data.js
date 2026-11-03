export const APP_CONFIG = {
  appName: "FinPath",
  appSlogan: "Aprende hoy, decide mejor mañana.",
  colors: {
    yellow: "#fdbf04",
    sky: "#72b6fd",
    blue: "#0068fb",
    blueSoft: "#449bfd",
    navy: "#003ea2",
    ink: "#061a3a"
  }
};



export const TRIAGE_QUESTIONS = [

    {

        id: "q1",

        question: "¿Qué tan cómodo te sientes manejando tu dinero?",

        description: "Esto nos ayuda a personalizar tu experiencia.",

        options: [

            { id: "q1_a", label: "Me cuesta mucho organizarme", score: 1, interestTag: "basic_money_management" },

            { id: "q1_b", label: "Se algunas cosas, pero no soy constante", score: 2, interestTag: "habits" },

            { id: "q1_c", label: "Tengo un sistema básico para organizarme", score: 3, interestTag: "planning" },

            { id: "q1_d", label: "Manejo presupuesto, ahorro y metas", score: 4, interestTag: "advanced_planning" },

        ],

    },

    {

        id: "q2",

        question: "¿Qué haces cuando recibes dinero?",

        description: "Queremos entender tus hábitos actuales.",

        options: [

            { id: "q2_a", label: "Lo gasto sin planear mucho", score: 1, interestTag: "spending_control" },

            { id: "q2_b", label: "Pago cosas importantes y luego miro qué queda", score: 2, interestTag: "budgeting" },

            { id: "q2_c", label: "Separo una parte para ahorrar", score: 3, interestTag: "saving" },

            { id: "q2_d", label: "Lo distribuyo entre presupuesto, ahorro e inversión", score: 4, interestTag: "planning" },

        ],

    },

    {

        id: "q3",

        question: "¿Sabes cuánto gastas al mes?",

        description: "El control del gasto es una base importante.",

        options: [

            { id: "q3_a", label: "No, casi nunca lo reviso", score: 1, interestTag: "expense_tracking" },

            { id: "q3_b", label: "Tengo una idea aproximada", score: 2, interestTag: "expense_tracking" },

            { id: "q3_c", label: "Sí, lo anoto algunas veces", score: 3, interestTag: "budgeting" },

            { id: "q3_d", label: "Sí, llevo control detallado", score: 4, interestTag: "advanced_planning" },

        ],

    },

    {

        id: "q4",

        question: "¿Tienes una meta financiera activa?",

        description: "Por ejemplo, ahorrar, pagar una deuda o controlar gastos.",

        options: [

            { id: "q4_a", label: "No tengo ninguna", score: 1, interestTag: "goal_setting" },

            { id: "q4_b", label: "Tengo una idea, pero no la he organizado", score: 2, interestTag: "goal_setting" },

            { id: "q4_c", label: "Sí, tengo una meta definida", score: 3, interestTag: "saving" },

            { id: "q4_d", label: "Sí, tengo varias metas con seguimiento", score: 4, interestTag: "advanced_planning" },

        ],

    },

    {

        id: "q5",

        question: "¿Qué tema te interésa aprender primero?",

        description: "Te recomendaremos rutas según tus interéses.",

        options: [

            { id: "q5_a", label: "Aprender a ahorrar", score: 2, interestTag: "saving" },

            { id: "q5_b", label: "Controlar gastos impulsivos", score: 2, interestTag: "spending_control" },

            { id: "q5_c", label: "Crear un presupuesto", score: 2, interestTag: "budgeting" },

            { id: "q5_d", label: "Tomar mejores decisiones financieras", score: 2, interestTag: "decisión_making" },

        ],

    },

    {

        id: "q6",

        question: "¿Qué tan difícil te parece ahorrar?",

        description: "Esto ayuda a definir el tipo de metas iniciales.",

        options: [

            { id: "q6_a", label: "Muy difícil, casi nunca ahorro", score: 1, interestTag: "saving" },

            { id: "q6_b", label: "A veces ahorro, pero no soy constante", score: 2, interestTag: "habits" },

            { id: "q6_c", label: "Puedo ahorrar si tengo una meta clara", score: 3, interestTag: "goal_setting" },

            { id: "q6_d", label: "Ahorro regularmente", score: 4, interestTag: "advanced_planning" },

        ],

    },

    {

        id: "q7",

        question: "Cuando compras algo no planeado, ¿qué suele pasar?",

        description: "Identificaremos oportunidades de autocontrol financiero.",

        options: [

            { id: "q7_a", label: "Lo hago con frecuencia y luego me arrepiento", score: 1, interestTag: "spending_control" },

            { id: "q7_b", label: "A veces pasa, pero intento corregirlo", score: 2, interestTag: "habits" },

            { id: "q7_c", label: "Comparo opciones antes de comprar", score: 3, interestTag: "decisión_making" },

            { id: "q7_d", label: "Uso reglas claras antes de gastar", score: 4, interestTag: "advanced_planning" },

        ],

    },

  {
    id: "q8_profile_age", profileOnly: true,
    question: "¿En qué rango de edad estás?", description: "Esto nos ayuda a analizar si FinPath llega a su público objetivo.",
    options: [
      {id:"q8_a",label:"18–24 años"},{id:"q8_b",label:"25–34 años"},
      {id:"q8_c",label:"35–54 años"},{id:"q8_d",label:"55 años o más"}
    ]
  },
  {
    id: "q9_profile_occupation", profileOnly: true,
    question: "¿Cuál es tu ocupación principal?", description: "Esta respuesta no cambia tu nivel financiero.",
    options: [
      {id:"q9_a",label:"Estudiante"},{id:"q9_b",label:"Empleado"},
      {id:"q9_c",label:"Independiente"},{id:"q9_d",label:"Estudia y trabaja"},
      {id:"q9_e",label:"Otro"}
    ]
  },
  {
    id: "q10_profile_pain", profileOnly: true,
    question: "En el último mes, ¿cuál de estas situaciones te pasó más?",
    description: "Nos ayuda a entender qué te interesa resolver primero.",
    options: [
      {id:"q10_a", label:"Me quedé sin plata antes de lo esperado"},
      {id:"q10_b", label:"No supe en qué se me fue el dinero"},
      {id:"q10_c", label:"Intenté ahorrar y no lo logré"},
      {id:"q10_d", label:"Pagué intereses o cuotas que no tenía claras"},
      {id:"q10_e", label:"Ninguna de estas"}
    ]
  },

];



export const GOAL_TEMPLATES = [

    {

        id: "template_save_10k_week",

        title: "Ahorrar $10.000 esta semana",

        description: "Empieza con una meta pequeña y alcanzable.",

        type: "saving_amount",

        suggestedLevel: "beginner",

        tags: ["saving", "habits"],

        iconKey: "Wallet",

        defaultTargetAmount: 10000,

        defaultDurationDays: 7,

        defaultTargetLessons: 0,

        difficulty: "easy",

    },

    {

        id: "template_track_expenses_3_days",

        title: "Registrar gastos durante 3 días",

        description: "Observa en qué se va tu dinero antes de intentar cambiarlo.",

        type: "habit_streak",

        suggestedLevel: "beginner",

        tags: ["expense_tracking", "habits"],

        iconKey: "ClipboardCheck",

        defaultTargetAmount: 0,

        defaultDurationDays: 3,

        defaultTargetLessons: 0,

        difficulty: "easy",

    },

    {

        id: "template_reduce_entertainment",

        title: "Reducir gastos de entretenimiento",

        description: "Controla pequeños gastos que se acumulan durante la semana.",

        type: "expense_limit",

        suggestedLevel: "intermediate",

        tags: ["spending_control", "budgeting"],

        iconKey: "Gamepad2",

        defaultTargetAmount: 50000,

        defaultDurationDays: 7,

        defaultTargetLessons: 0,

        difficulty: "medium",

    },

    {

        id: "template_complete_3_lessons",

        title: "Completar 3 lecciones esta semana",

        description: "Construye conocimiento financiero paso a paso.",

        type: "lesson_completion",

        suggestedLevel: "beginner",

        tags: ["learning", "habits"],

        iconKey: "BookOpenCheck",

        defaultTargetAmount: 0,

        defaultDurationDays: 7,

        defaultTargetLessons: 3,

        difficulty: "easy",

    },

    {

        id: "template_cash_control_week",

        title: "Revisar gastos cada noche",

        description: "Cierra el dia revisando si tus gastos fueron necesarios o impulsivos.",

        type: "habit_streak",

        suggestedLevel: "intermediate",

        tags: ["expense_tracking", "spending_control"],

        iconKey: "Moon",

        defaultTargetAmount: 0,

        defaultDurationDays: 7,

        defaultTargetLessons: 0,

        difficulty: "medium",

    },

  {id:"template_emergency_120k", title:"Fondo de emergencia de $120.000",
    description:"Separa aportes para imprevistos y conserva acceso rápido al dinero.",
    type:"saving_amount", suggestedLevel:"beginner", tags:["saving","goal_setting"],
    iconKey:"ShieldCheck", defaultTargetAmount:120000,defaultDurationDays:42,defaultTargetLessons:0,difficulty:"easy"},
  {id:"template_pay_debt_300k",title:"Abonar una deuda de $300.000",
    description:"Registra cada abono para ver cuánto resta del saldo inicial.",
    type:"debt_payoff",suggestedLevel:"intermediate", tags:["planning","spending_control"],
    iconKey:"CreditCard",defaultTargetAmount:300000,defaultDurationDays:90,defaultTargetLessons:0,difficulty:"medium"},
  {id:"template_expense_food_week",title:"Límite semanal para comida fuera",
    description:"Define un tope ilustrativo de $60.000 por semana para comida fuera.",
    type:"expense_limit",suggestedLevel:"beginner",tags:["budgeting","spending_control"],
    iconKey:"Utensils",defaultTargetAmount:60000,defaultDurationDays:7,defaultTargetLessons:0,difficulty:"medium"},

  {id:"template_financial_check_5days",title:"Revisar mis decisiones financieras durante 5 días",
    description:"Antes de aceptar una compra o una oferta, revisa costo, riesgo y necesidad.",
    type:"habit_streak",suggestedLevel:"advanced", tags:["decisión_making","advanced_planning"],
    iconKey:"ClipboardCheck",defaultTargetAmount:0,defaultDurationDays:5,defaultTargetLessons:0,difficulty:"medium"},

];



export const LEARNING_PATHS = [
  {
    "id": "path_saving_expenses",
    "title": "Ahorro y gastos",
    "description": "Aprende a detectar gastos recurrentes, priorizar y crear una reserva para imprevistos.",
    "level": "beginner",
    "tags": [
      "basic_money_management",
      "saving",
      "goal_setting",
      "habits"
    ],
    "iconKey": "PiggyBank",
    "color": "#0068fb",
    "lessons": [
      {
        "id": "lesson_where_money_goes",
        "order": 1,
        "title": "Detecta gastos repetidos y separa el ahorro",
        "description": "Calcula gastos hormiga y descubre por qué ahorrar antes de gastar ayuda a afrontar imprevistos.",
        "estimatedMinutes": 5,
        "xpReward": 14,
        "skillTags": [
          "gastos_recurrentes"
        ],
        "sources": [
          {
            "name": "Asobancaria — ABC del ahorro",
            "url": "https://www.sabermassermas.com/ahorro-e-inversion/abc-del-ahorro/"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Banca de las Oportunidades — Contenidos mínimos EEF (Colombia)",
            "url": "https://www.bancadelasoportunidades.gov.co/index.php/en/node/1065"
          }
        ],
        "steps": [
          {
            "id": "l1_s1",
            "type": "content",
            "title": "El dinero también se va en rutinas",
            "body": "Recibes $600.000 al mes entre trabajo y apoyo familiar. Ahorrar te permite prepararte para un daño del celular o una meta, sin depender siempre de un préstamo."
          },
          {
            "id": "l1_s2",
            "type": "content",
            "title": "Observa, calcula y decide",
            "body": "Un gasto de $7.000, cuatro días por semana durante cuatro semanas, suma $112.000 al mes. Un hábito útil es separar una cantidad viable al recibir dinero: es “pagarte primero”, no ahorrar solo si sobra."
          },
          {
            "id": "l1_s3",
            "type": "question",
            "title": "Dos estrategias posibles",
            "body": "¿Cuál plan hace más previsible ahorrar $40.000 de los $600.000 que recibes al mes?",
            "skillTag": "gastos_recurrentes",
            "options": [
              {
                "id": "a",
                "label": "Separar $10.000 cada semana antes de gastos flexibles.",
                "feedback": "Correcto. La frecuencia y el monto están definidos; después ajustas tus gastos flexibles al saldo."
              },
              {
                "id": "b",
                "label": "Intentar dejar $40.000 sin gastar el último día.",
                "feedback": "Parece flexible, pero deja el ahorro expuesto a compras durante todo el mes."
              },
              {
                "id": "c",
                "label": "Guardar $40.000 si el mes tiene menos imprevistos.",
                "feedback": "Considerar imprevistos es razonable, pero no establece una acción periódica; conviene revisar primero cuánto sí puedes separar."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "l1_s4",
            "type": "question",
            "title": "El costo que se acumula",
            "body": "¿Cuánto representan en 12 meses unas compras de $6.000, cinco días por semana, durante cuatro semanas al mes?",
            "skillTag": "gastos_recurrentes",
            "options": [
              {
                "id": "a",
                "label": "$1.440.000.",
                "feedback": "Correcto: $6.000 × 5 × 4 × 12 = $1.440.000. No implica que debas eliminar el gasto, sino conocer su magnitud."
              },
              {
                "id": "b",
                "label": "$360.000.",
                "feedback": "Ese resultado subestima las repeticiones: faltó multiplicar por todos los meses."
              },
              {
                "id": "c",
                "label": "$1.200.000.",
                "feedback": "Es un error probable si cuentas 20 días durante 10 meses; el caso plantea 12."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "l1_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Esta semana registra tres gastos repetidos y calcula su costo mensual. Decide qué monto puedes separar al recibir dinero, sin desatender tus necesidades."
          },
          {
            "id": "l1_s6",
            "type": "action",
            "title": "Practícalo con una meta",
            "body": "Puedes empezar observando tus gastos o separando un monto pequeño; omitir esta sugerencia no impide terminar.",
            "optional": true,
            "options": [
              {
                "id": "template_track_expenses_3_days",
                "label": "Registrar gastos durante 3 días"
              },
              {
                "id": "template_save_10k_week",
                "label": "Ahorrar $10.000 esta semana"
              }
            ]
          }
        ],
        "pathId": "path_saving_expenses"
      },
      {
        "id": "lesson_needs_wants",
        "order": 2,
        "title": "Necesidades, deseos e impulsos sin confundirlos",
        "description": "Diferencia prioridades de consumo y reconoce cuándo el impulso es una forma de comprar, no un tipo de producto.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "priorizar_gastos"
        ],
        "sources": [
          {
            "name": "Finanzas para Todos — Mi presupuesto",
            "url": "https://www.finanzasparatodos.es/herramientas/mipresupuesto"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Banca de las Oportunidades — Contenidos mínimos EEF (Colombia)",
            "url": "https://www.bancadelasoportunidades.gov.co/index.php/en/node/1065"
          }
        ],
        "steps": [
          {
            "id": "l2_s1",
            "type": "content",
            "title": "Una necesidad puede costar más de lo necesario",
            "body": "Necesitas almorzar, pero eso no vuelve imprescindible el domicilio de $32.000. “Necesidad o deseo” describe la prioridad; “impulsivo o planeado” describe cómo decides comprar."
          },
          {
            "id": "l2_s2",
            "type": "content",
            "title": "Dos preguntas, no tres etiquetas mezcladas",
            "body": "Primero pregunta: “¿esto cubre una necesidad o un deseo?”. Después: “¿lo planeé o reaccioné al momento?”. Un deseo legítimo cabe en el presupuesto cuando no desplaza obligaciones."
          },
          {
            "id": "l2_s3",
            "type": "classify",
            "title": "Clasifica la prioridad",
            "body": "Clasifica cada situación según su finalidad principal: necesidad o deseo. No evalúes todavía si la compra fue impulsiva ¿A qué categoría corresponde cada caso?",
            "skillTag": "priorizar_gastos",
            "categories": [
              {
                "id": "need",
                "label": "Necesidad"
              },
              {
                "id": "want",
                "label": "Deseo"
              }
            ],
            "items": [
              {
                "id": "i1",
                "label": "Pasaje del MIO para llegar a clase.",
                "correctCategoryId": "need",
                "feedback": "Permite cubrir el transporte necesario para estudiar."
              },
              {
                "id": "i2",
                "label": "Mejorar a una versión más costosa de unos audífonos que funcionan.",
                "correctCategoryId": "want",
                "feedback": "La mejora es opcional aunque los audífonos puedan ser útiles."
              },
              {
                "id": "i3",
                "label": "Almuerzo sencillo durante una jornada completa fuera de casa.",
                "correctCategoryId": "need",
                "feedback": "La alimentación es una necesidad; el precio elegido se evalúa aparte."
              },
              {
                "id": "i4",
                "label": "Pedir domicilio por comodidad cuando ya hay comida preparada.",
                "correctCategoryId": "want",
                "feedback": "La conveniencia es válida, pero aquí no es indispensable."
              }
            ]
          },
          {
            "id": "l2_s4",
            "type": "question",
            "title": "Una decisión con números",
            "body": "¿Cuál es el ahorro si cubres tu almuerzo de $32.000 con una alternativa de $19.000, dos veces por semana durante cuatro semanas?",
            "skillTag": "priorizar_gastos",
            "options": [
              {
                "id": "a",
                "label": "$13.000 al mes.",
                "feedback": "Es la diferencia de un almuerzo; faltó contar las ocho ocasiones."
              },
              {
                "id": "b",
                "label": "$104.000 al mes.",
                "feedback": "Correcto: ($32.000 − $19.000) × 2 × 4 = $104.000. La necesidad sigue cubierta."
              },
              {
                "id": "c",
                "label": "$152.000 al mes.",
                "feedback": "Eso sería $19.000 × 8: el gasto de la alternativa, no el ahorro."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "l2_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Priorizar no es eliminar todo deseo. Esta semana revisa una compra: define su finalidad, si fue planeada y cuánto afecta tu presupuesto."
          },
          {
            "id": "l2_s6",
            "type": "action",
            "title": "Sugerencia voluntaria",
            "body": "Una revisión breve te ayuda a identificar deseos y compras impulsivas sin juzgarlos.",
            "optional": true,
            "options": [
              {
                "id": "template_track_expenses_3_days",
                "label": "Registrar gastos durante 3 días"
              }
            ]
          }
        ],
        "pathId": "path_saving_expenses"
      },
      {
        "id": "lesson_first_small_goal",
        "order": 3,
        "title": "Construye tu primer fondo de emergencia",
        "description": "Define un objetivo SMART y un aporte sostenible, separado del dinero de uso diario.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "plan_ahorro"
        ],
        "sources": [
          {
            "name": "CFPB — Guía para crear un fondo de emergencia",
            "url": "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Asobancaria — ABC del ahorro",
            "url": "https://www.sabermassermas.com/ahorro-e-inversion/abc-del-ahorro/"
          }
        ],
        "steps": [
          {
            "id": "l3_s1",
            "type": "content",
            "title": "Un imprevisto no avisa",
            "body": "Si un arreglo urgente cuesta $180.000 y no tienes reserva, quizá debas endeudarte. Un fondo de emergencia es dinero apartado para gastos realmente inesperados, disponible cuando se necesita."
          },
          {
            "id": "l3_s2",
            "type": "content",
            "title": "Haz una primera meta medible",
            "body": "Una meta SMART (específica, medible, alcanzable, relevante y con plazo) indica cuánto, para qué, cuándo y cómo. Ejemplo: reunir $120.000 en seis semanas con aportes de $20.000; si el monto no cabe en tu presupuesto, ajusta el plazo. Si es viable, automatiza el aporte al recibir ingresos."
          },
          {
            "id": "l3_s3",
            "type": "question",
            "title": "Separar sin inmovilizar",
            "body": "¿Dónde tiene más sentido guardar una primera reserva para una reparación urgente?",
            "skillTag": "plan_ahorro",
            "options": [
              {
                "id": "a",
                "label": "En un instrumento que penaliza cualquier retiro anticipado.",
                "feedback": "Podría generar rendimiento, pero reduce el acceso oportuno, que es esencial para un fondo de emergencia."
              },
              {
                "id": "b",
                "label": "Separada de los gastos diarios y con acceso relativamente rápido.",
                "feedback": "Correcto. La prioridad es disponibilidad y seguridad, no perseguir el rendimiento más alto."
              },
              {
                "id": "c",
                "label": "En la misma cuenta de compras, sin identificar cuánto pertenece al fondo.",
                "feedback": "El dinero sigue disponible, pero es fácil usarlo sin advertir que pertenece a emergencias."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "l3_s4",
            "type": "question",
            "title": "Cuota de ahorro realizable",
            "body": "¿Cuánto necesitas apartar cada semana para reunir $150.000 en 10 semanas, empezando desde cero?",
            "skillTag": "plan_ahorro",
            "options": [
              {
                "id": "a",
                "label": "$15.000.",
                "feedback": "Correcto: $150.000 ÷ 10 semanas = $15.000 por semana, siempre que puedas sostenerlo."
              },
              {
                "id": "b",
                "label": "$10.000.",
                "feedback": "Reunirías $100.000. La diferencia requeriría más semanas o mayores aportes."
              },
              {
                "id": "c",
                "label": "$25.000.",
                "feedback": "Llegarías en seis semanas: no es incorrecto ahorrar más, pero no responde al plazo propuesto."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "l3_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Empieza con un imprevisto realista de tu vida. Define monto, fecha y aporte; si usas la reserva, crea un plan para reponerla."
          },
          {
            "id": "l3_s6",
            "type": "action",
            "title": "Reserva opcional",
            "body": "Puedes iniciar una meta independiente para emergencias y registrar pequeños aportes.",
            "optional": true,
            "options": [
              {
                "id": "template_emergency_120k",
                "label": "Armar un fondo de emergencia de $120.000"
              },
              {
                "id": "template_save_10k_week",
                "label": "Ahorrar $10.000 esta semana"
              }
            ]
          }
        ],
        "pathId": "path_saving_expenses"
      }
    ]
  },
  {
    "id": "path_budgeting",
    "title": "Presupuesto personal",
    "description": "Aprende a manejar ingreso neto, pagos periódicos y métodos de presupuesto que sí puedas revisar.",
    "level": "intermediate",
    "tags": [
      "budgeting",
      "expense_tracking"
    ],
    "iconKey": "ChartNoAxesColumnIncreasing",
    "color": "#449bfd",
    "lessons": [
      {
        "id": "lesson_budget_intro",
        "order": 1,
        "title": "Presupuesta con el dinero que realmente recibes",
        "description": "Usa ingreso neto, estima ingresos irregulares y elige una distribución viable.",
        "estimatedMinutes": 5,
        "xpReward": 14,
        "skillTags": [
          "ingreso_disponible"
        ],
        "sources": [
          {
            "name": "Finanzas para Todos — Mi presupuesto",
            "url": "https://www.finanzasparatodos.es/herramientas/mipresupuesto"
          },
          {
            "name": "Finanzas para Todos — Cómo elaborar un presupuesto",
            "url": "https://www.finanzasparatodos.es/como-elaborar-un-presupuesto"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          }
        ],
        "steps": [
          {
            "id": "b1_s1",
            "type": "content",
            "title": "Tu salario anunciado no siempre es el disponible",
            "body": "Te ofrecen un ingreso bruto de $1.400.000, pero después de deducciones recibes $1.280.000: este es tu ingreso neto ilustrativo. El presupuesto parte de lo que efectivamente te llega."
          },
          {
            "id": "b1_s2",
            "type": "content",
            "title": "Las reglas son guías, no obligaciones",
            "body": "La pauta 50/30/20 divide 50 % necesidades, 30 % deseos y 20 % metas o ahorro. No funciona igual para todos: si tus necesidades cuestan más del 50 %, comienza por obligaciones reales y ajusta lo demás."
          },
          {
            "id": "b1_s3",
            "type": "question",
            "title": "Ingresos variables",
            "body": "¿Qué base resulta más prudente para gastos obligatorios si tus ingresos netos de los últimos tres meses fueron $800.000, $1.000.000 y $700.000?",
            "skillTag": "ingreso_disponible",
            "options": [
              {
                "id": "a",
                "label": "$1.000.000, porque fue el mejor mes.",
                "feedback": "Presupuestar con el máximo puede dejar obligaciones sin cubrir en meses más bajos."
              },
              {
                "id": "b",
                "label": "$833.333, el promedio aproximado.",
                "feedback": "El promedio sirve para analizar, pero puede sobreestimar lo disponible el mes de $700.000."
              },
              {
                "id": "c",
                "label": "$700.000 como base conservadora, y planear aparte los excedentes.",
                "feedback": "Correcto. Parte de un monto que ya has recibido y ajusta si tienes mayor estabilidad histórica."
              }
            ],
            "correctOptionId": "c"
          },
          {
            "id": "b1_s4",
            "type": "question",
            "title": "Primero calcula el neto",
            "body": "¿Cuánto queda para repartir si recibes $1.200.000 netos y tienes $850.000 en obligaciones y compras esenciales previstas?",
            "skillTag": "ingreso_disponible",
            "options": [
              {
                "id": "a",
                "label": "$350.000.",
                "feedback": "Correcto: $1.200.000 − $850.000 = $350.000 para metas, flexibles e imprevistos."
              },
              {
                "id": "b",
                "label": "$600.000.",
                "feedback": "Eso equivale a la mitad del ingreso, pero no incorpora tus obligaciones reales."
              },
              {
                "id": "c",
                "label": "$240.000.",
                "feedback": "Es el 20 % del ingreso: la regla 50/30/20 no sustituye este cálculo."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "b1_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Esta semana anota tus ingresos netos y tus obligaciones. Solo después distribuye el saldo entre ahorro, imprevistos y gastos flexibles."
          },
          {
            "id": "b1_s6",
            "type": "action",
            "title": "Crea un hábito, si te sirve",
            "body": "Revisar tus cifras tres días puede darte una base mejor para tu primer presupuesto.",
            "optional": true,
            "options": [
              {
                "id": "template_track_expenses_3_days",
                "label": "Registrar gastos durante 3 días"
              }
            ]
          }
        ],
        "pathId": "path_budgeting"
      },
      {
        "id": "lesson_fixed_variable",
        "order": 2,
        "title": "Gastos fijos, variables y los que llegan una vez al año",
        "description": "Distingue frecuencia de prioridad y convierte pagos grandes en reservas mensuales.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "clasificar_gastos"
        ],
        "sources": [
          {
            "name": "Finanzas para Todos — Mi presupuesto",
            "url": "https://www.finanzasparatodos.es/herramientas/mipresupuesto"
          },
          {
            "name": "Finanzas para Todos — Siete pasos para crear un presupuesto mensual",
            "url": "https://www.finanzasparatodos.es/siete-pasos-para-crear-tu-presupuesto-mensual"
          },
          {
            "name": "Banca de las Oportunidades — Contenidos mínimos EEF (Colombia)",
            "url": "https://www.bancadelasoportunidades.gov.co/index.php/en/node/1065"
          }
        ],
        "steps": [
          {
            "id": "b2_s1",
            "type": "content",
            "title": "Fijo no es lo mismo que necesario",
            "body": "El arriendo suele ser fijo; la alimentación es necesaria, pero su costo varía. También existen pagos poco frecuentes y previsibles como una matrícula o el Seguro Obligatorio de Accidentes de Tránsito (SOAT): no son emergencias por aparecer pocas veces."
          },
          {
            "id": "b2_s2",
            "type": "content",
            "title": "Prorratea para no llevarte sorpresas",
            "body": "Prorratear es repartir un gasto futuro entre meses. Si prevés $360.000 de un pago anual, apartar $30.000 durante 12 meses evita cargar todo a un solo mes."
          },
          {
            "id": "b2_s3",
            "type": "classify",
            "title": "Clasifica según su frecuencia",
            "body": "Clasifica cada gasto según cómo se presenta en este caso, no según si te gusta o es indispensable ¿A qué categoría corresponde cada caso?",
            "skillTag": "clasificar_gastos",
            "categories": [
              {
                "id": "fijo",
                "label": "Fijo mensual"
              },
              {
                "id": "variable",
                "label": "Variable mensual"
              },
              {
                "id": "ocasional",
                "label": "Ocasional previsto"
              }
            ],
            "items": [
              {
                "id": "i1",
                "label": "Arriendo con cuota mensual pactada de $450.000.",
                "correctCategoryId": "fijo",
                "feedback": "La obligación es mensual y el valor pactado se mantiene durante el periodo."
              },
              {
                "id": "i2",
                "label": "Mercado que cambia entre $140.000 y $190.000 cada mes.",
                "correctCategoryId": "variable",
                "feedback": "La alimentación es necesaria, pero el monto fluctúa."
              },
              {
                "id": "i3",
                "label": "Renovar el SOAT de la moto una vez al año.",
                "correctCategoryId": "ocasional",
                "feedback": "Es periódico y previsible, aunque no sea mensual."
              },
              {
                "id": "i4",
                "label": "Salidas de fin de semana con gasto distinto cada vez.",
                "correctCategoryId": "variable",
                "feedback": "Aparece con frecuencia, pero el monto puede cambiar."
              }
            ]
          },
          {
            "id": "b2_s4",
            "type": "question",
            "title": "Convierte el pago a cuota mensual",
            "body": "¿Cuánto deberías separar por mes para reunir $480.000 para una matrícula que pagarás en ocho meses, partiendo de cero?",
            "skillTag": "clasificar_gastos",
            "options": [
              {
                "id": "a",
                "label": "$40.000.",
                "feedback": "Ese monto alcanzaría si tuvieras doce meses; aquí solo hay ocho."
              },
              {
                "id": "b",
                "label": "$60.000.",
                "feedback": "Correcto: $480.000 ÷ 8 = $60.000 por mes."
              },
              {
                "id": "c",
                "label": "$80.000.",
                "feedback": "Con esa cuota llegarías en seis meses; no es necesaria para el plazo dado."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "b2_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Haz una lista de pagos anuales o semestrales. Divide cada monto entre los meses disponibles y reserva esa cuota junto a tus gastos mensuales."
          },
          {
            "id": "b2_s6",
            "type": "action",
            "title": "Una meta para anticiparte",
            "body": "Puedes crear una reserva para un pago previsto y evitar que parezca un imprevisto.",
            "optional": true,
            "options": [
              {
                "id": "template_save_10k_week",
                "label": "Iniciar una reserva pequeña"
              }
            ]
          }
        ],
        "pathId": "path_budgeting"
      },
      {
        "id": "lesson_budget_review",
        "order": 3,
        "title": "Tres métodos de presupuesto y cómo ajustar el tuyo",
        "description": "Compara 50/30/20, sobres y base cero; revisa desviaciones sin abandonar el plan.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "revision_presupuesto"
        ],
        "sources": [
          {
            "name": "Finanzas para Todos — Siete pasos para crear un presupuesto mensual",
            "url": "https://www.finanzasparatodos.es/siete-pasos-para-crear-tu-presupuesto-mensual"
          },
          {
            "name": "Finanzas para Todos — Mi presupuesto",
            "url": "https://www.finanzasparatodos.es/herramientas/mipresupuesto"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          }
        ],
        "steps": [
          {
            "id": "b3_s1",
            "type": "content",
            "title": "Elige un método por su función",
            "body": "50/30/20 sirve como referencia flexible. Sobres significa asignar límites por categoría; presupuesto base cero significa dar un destino a cada peso hasta que ingresos menos asignaciones sea cero, sin obligarte a gastarlo."
          },
          {
            "id": "b3_s2",
            "type": "content",
            "title": "La revisión convierte el plan en herramienta",
            "body": "Si asignaste $160.000 a transporte y gastaste $190.000, hay una diferencia de $30.000. Busca de dónde cubrirla o ajusta el siguiente periodo según la causa, sin esconderla."
          },
          {
            "id": "b3_s3",
            "type": "question",
            "title": "El método adecuado",
            "body": "¿Qué método ayuda más si no quieres superar $90.000 mensuales en domicilios y te cuesta detenerte a tiempo?",
            "skillTag": "revision_presupuesto",
            "options": [
              {
                "id": "a",
                "label": "Sobres: asignar $90.000 a esa categoría y revisar lo que queda.",
                "feedback": "Correcto. Un límite por categoría ayuda a controlar el gasto a medida que ocurre."
              },
              {
                "id": "b",
                "label": "50/30/20 sin registrar ninguna compra.",
                "feedback": "La proporción es útil como punto de partida, pero no controla una categoría específica por sí sola."
              },
              {
                "id": "c",
                "label": "Presupuesto base cero solo al final del mes.",
                "feedback": "Base cero se construye antes de gastar: asignar al final no evitaría pasarte del límite."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "b3_s4",
            "type": "question",
            "title": "Cierre de presupuesto",
            "body": "¿Cuánto queda sin asignar si recibes $900.000 y distribuyes $550.000 en necesidades, $150.000 en ahorro y $120.000 en flexibles?",
            "skillTag": "revision_presupuesto",
            "options": [
              {
                "id": "a",
                "label": "$0; ya es un presupuesto base cero.",
                "feedback": "Las partidas suman $820.000, así que faltan $80.000 por asignar."
              },
              {
                "id": "b",
                "label": "$80.000.",
                "feedback": "Correcto: $900.000 − ($550.000 + $150.000 + $120.000) = $80.000. Puedes asignarlos a reserva o a otra categoría."
              },
              {
                "id": "c",
                "label": "$180.000.",
                "feedback": "Esa diferencia no corresponde a la suma de las tres categorías."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "b3_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Esta semana compara un presupuesto planeado con tus gastos reales. Cambia una asignación concreta y explica por qué, sin tocar obligaciones básicas."
          },
          {
            "id": "b3_s6",
            "type": "action",
            "title": "Prueba una rutina",
            "body": "Puedes revisar gastos cada noche como primer control del presupuesto.",
            "optional": true,
            "options": [
              {
                "id": "template_cash_control_week",
                "label": "Revisar gastos cada noche"
              }
            ]
          }
        ],
        "pathId": "path_budgeting"
      }
    ]
  },
  {
    "id": "path_decisión_making",
    "title": "Decisiones financieras inteligentes",
    "description": "Evalúa costos ocultos, sesgos de consumo y el efecto de la inflación sobre tus decisiones.",
    "level": "advanced",
    "tags": [
      "decisión_making",
      "planning"
    ],
    "iconKey": "Brain",
    "color": "#fdbf04",
    "lessons": [
      {
        "id": "lesson_opportunity_cost",
        "order": 1,
        "title": "Cuánto te cuesta elegir: costo de oportunidad",
        "description": "Identifica la mejor alternativa que dejas pasar y compara sus consecuencias.",
        "estimatedMinutes": 5,
        "xpReward": 14,
        "skillTags": [
          "costo_oportunidad"
        ],
        "sources": [
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Finanzas para Todos — Cómo elaborar un presupuesto",
            "url": "https://www.finanzasparatodos.es/como-elaborar-un-presupuesto"
          },
          {
            "name": "G20/OECD INFE — Competencias financieras para adultos",
            "url": "https://www.gpfi.org/publications/g20oecd-infe-core-competencies-framework-financial-literacy-adults"
          }
        ],
        "steps": [
          {
            "id": "d1_s1",
            "type": "content",
            "title": "Pagar no es lo mismo que decidir",
            "body": "Tienes $180.000 disponibles: puedes inscribirte a un taller útil o comprar un accesorio. El costo de oportunidad de una elección es el valor de la mejor alternativa a la que renuncias, no necesariamente la suma de todas."
          },
          {
            "id": "d1_s2",
            "type": "content",
            "title": "El intercambio puede medirse",
            "body": "Si gastas $45.000 en algo, también renuncias a destinarlos a una meta que te falta por cumplir. Antes de decidir, compara utilidad, fecha de necesidad y qué alternativa se aplaza."
          },
          {
            "id": "d1_s3",
            "type": "question",
            "title": "Escoge la mejor alternativa perdida",
            "body": "¿Cuál es el costo de oportunidad de comprar una chaqueta si tu mejor alternativa era pagar un curso que también costaba $120.000?",
            "skillTag": "costo_oportunidad",
            "options": [
              {
                "id": "a",
                "label": "Todos los deseos futuros que podrías haber comprado.",
                "feedback": "El concepto se refiere a la mejor alternativa sacrificada, no a sumar todas las posibilidades."
              },
              {
                "id": "b",
                "label": "El valor o beneficio del curso al que renuncias.",
                "feedback": "Correcto. La alternativa relevante es el curso que elegirías si no compraras la chaqueta."
              },
              {
                "id": "c",
                "label": "Cero, porque la chaqueta se pagó con dinero propio.",
                "feedback": "Usar dinero propio no elimina las alternativas a las que renuncias."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "d1_s4",
            "type": "question",
            "title": "Un costo de oportunidad cuantificable",
            "body": "¿Cuánto te falta para una meta de $300.000 si ya tienes $220.000 y decides gastar $30.000 de ese ahorro?",
            "skillTag": "costo_oportunidad",
            "options": [
              {
                "id": "a",
                "label": "$80.000.",
                "feedback": "Ese era el faltante antes de gastar los $30.000."
              },
              {
                "id": "b",
                "label": "$50.000.",
                "feedback": "Ese resultado resta la compra al faltante, pero la compra reduce tu ahorro acumulado."
              },
              {
                "id": "c",
                "label": "$110.000.",
                "feedback": "Correcto: el ahorro bajaría a $190.000; $300.000 − $190.000 = $110.000."
              }
            ],
            "correctOptionId": "c"
          },
          {
            "id": "d1_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Antes de una compra importante, nombra la mejor alternativa que sacrificarías. Anota cuánto cambia tu meta o presupuesto al escogerla."
          },
          {
            "id": "d1_s6",
            "type": "action",
            "title": "Conecta con una meta",
            "body": "Una meta visible permite comparar mejor alternativas sin impedirte disfrutar.",
            "optional": true,
            "options": [
              {
                "id": "template_save_10k_week",
                "label": "Separar $10.000 esta semana"
              }
            ]
          }
        ],
        "pathId": "path_decisión_making"
      },
      {
        "id": "lesson_wait_or_buy",
        "order": 2,
        "title": "Ofertas, anclaje y cuotas que empujan a comprar",
        "description": "Reconoce presión de tiempo, precios de referencia y sesgos de compra.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "sesgos_consumo"
        ],
        "sources": [
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Finanzas para Todos — Cómo elaborar un presupuesto",
            "url": "https://www.finanzasparatodos.es/como-elaborar-un-presupuesto"
          },
          {
            "name": "G20/OECD INFE — Competencias financieras para adultos",
            "url": "https://www.gpfi.org/publications/g20oecd-infe-core-competencies-framework-financial-literacy-adults"
          }
        ],
        "steps": [
          {
            "id": "d2_s1",
            "type": "content",
            "title": "Tu cerebro usa atajos",
            "body": "Una oferta dice “antes $300.000, ahora $210.000 y termina hoy”. El precio tachado puede funcionar como ancla, aunque todavía debas comprobar si necesitas el producto y cuánto cuesta en otras tiendas."
          },
          {
            "id": "d2_s2",
            "type": "content",
            "title": "Cuotas y urgencia reducen la atención al total",
            "body": "Mirar solo “$35.000 al mes” puede ocultar el precio total. La pausa de 24 horas sirve para compras no urgentes; no es una regla para posponer salud o necesidades reales."
          },
          {
            "id": "d2_s3",
            "type": "question",
            "title": "Una oferta todavía necesita evaluación",
            "body": "¿Qué dato te ayuda más a decidir si unos zapatos de $210.000 son buena compra y no solo una rebaja aparente?",
            "skillTag": "sesgos_consumo",
            "options": [
              {
                "id": "a",
                "label": "Comparar su precio final y calidad con alternativas equivalentes, y revisar tu presupuesto.",
                "feedback": "Correcto. Así evalúas valor y capacidad de pago, no solo el precio tachado."
              },
              {
                "id": "b",
                "label": "Usar el supuesto precio anterior de $300.000 como única prueba.",
                "feedback": "El precio de referencia puede anclar la decisión sin demostrar el valor de mercado."
              },
              {
                "id": "c",
                "label": "Dividir los $210.000 en cuotas pequeñas para que parezca menos.",
                "feedback": "Las cuotas facilitan el flujo de caja, pero no reducen el costo total por sí mismas."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "d2_s4",
            "type": "question",
            "title": "Calcula el descuento real",
            "body": "¿Cuánto pagarías por un artículo de $250.000 con 20 % de descuento, sin costos adicionales?",
            "skillTag": "sesgos_consumo",
            "options": [
              {
                "id": "a",
                "label": "$230.000.",
                "feedback": "Eso equivale a una rebaja del 8 %, no del 20 %."
              },
              {
                "id": "b",
                "label": "$200.000.",
                "feedback": "Correcto: 20 % de $250.000 son $50.000; pagas $200.000."
              },
              {
                "id": "c",
                "label": "$187.500.",
                "feedback": "Eso sería un descuento del 25 %, mayor al anunciado."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "d2_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Cuando veas una oferta, calcula su precio final, consulta una alternativa y revisa si la compra estaba planeada. No confundas urgencia publicitaria con necesidad."
          },
          {
            "id": "d2_s6",
            "type": "action",
            "title": "Reto opcional",
            "body": "Registrar una compra que pausaste te ayuda a detectar patrones.",
            "optional": true,
            "options": [
              {
                "id": "template_track_expenses_3_days",
                "label": "Registrar gastos durante 3 días"
              }
            ]
          }
        ],
        "pathId": "path_decisión_making"
      },
      {
        "id": "lesson_compare_before_spending",
        "order": 3,
        "title": "Costo total e inflación: compara lo que realmente pagas",
        "description": "Suma financiación y mantenimiento; entiende por qué los precios cambian con el tiempo.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "costo_total"
        ],
        "sources": [
          {
            "name": "Banco de la República — Qué es la meta de inflación",
            "url": "https://www.banrep.gov.co/es/banrep-educa/econo-cimientos/que-es-meta-inflacion"
          },
          {
            "name": "Finanzas para Todos — Cómo elaborar un presupuesto",
            "url": "https://www.finanzasparatodos.es/como-elaborar-un-presupuesto"
          },
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          }
        ],
        "steps": [
          {
            "id": "d3_s1",
            "type": "content",
            "title": "El precio en vitrina no es el costo completo",
            "body": "Un computador cuesta $900.000 al contado. Financiado, pagarías 12 cuotas de $85.000 y $40.000 adicionales de cargos: en total serían $1.060.000. Compara montos completos, no solo cuotas."
          },
          {
            "id": "d3_s2",
            "type": "content",
            "title": "Los pesos también cambian de poder de compra",
            "body": "Inflación es el aumento generalizado y sostenido de precios. Si un producto de $100.000 sube 5 % en un ejemplo, necesitarás $105.000 para comprar lo mismo; ese 5 % es ilustrativo, no la inflación vigente."
          },
          {
            "id": "d3_s3",
            "type": "question",
            "title": "No compares solo cuotas",
            "body": "¿Qué alternativa tiene menor desembolso total para el mismo producto, sin otras diferencias: contado $480.000 o seis cuotas de $75.000 más un cargo único de $45.000?",
            "skillTag": "costo_total",
            "options": [
              {
                "id": "a",
                "label": "Las cuotas: $75.000 es menor que $480.000.",
                "feedback": "La cuota aislada no refleja el compromiso completo: 6 × $75.000 + $45.000."
              },
              {
                "id": "b",
                "label": "Ambas cuestan $480.000.",
                "feedback": "Faltó sumar los $45.000 de cargo a las seis cuotas."
              },
              {
                "id": "c",
                "label": "Contado: $480.000 frente a $495.000 financiado.",
                "feedback": "Correcto: $450.000 en cuotas más $45.000 de cargo suman $495.000."
              }
            ],
            "correctOptionId": "c"
          },
          {
            "id": "d3_s4",
            "type": "question",
            "title": "Proyecta sin confundir con la inflación real",
            "body": "¿Qué precio tendría un artículo de $200.000 tras un aumento hipotético único del 8 %?",
            "skillTag": "costo_total",
            "options": [
              {
                "id": "a",
                "label": "$216.000.",
                "feedback": "Correcto: $200.000 × 1,08 = $216.000. No es una predicción de la inflación real."
              },
              {
                "id": "b",
                "label": "$208.000.",
                "feedback": "Sumaste $8.000, no el 8 % de $200.000."
              },
              {
                "id": "c",
                "label": "$184.000.",
                "feedback": "Ese valor resta el 8 %, pero el caso plantea un aumento."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "d3_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Esta semana compara dos formas de pago usando el costo total. Si planeas una compra futura, considera que su precio puede cambiar."
          },
          {
            "id": "d3_s6",
            "type": "action",
            "title": "Cuida tu margen",
            "body": "Un límite de gasto puede ayudarte a reservar dinero para compras previstas.",
            "optional": true,
            "options": [
              {
                "id": "template_reduce_entertainment",
                "label": "Definir límite de entretenimiento"
              }
            ]
          }
        ],
        "pathId": "path_decisión_making"
      }
    ]
  },
  {
    "id": "path_credit_cards",
    "title": "Crédito y tarjetas",
    "description": "Aprende a leer extractos, comparar tasas y reducir deudas sin depender solo del pago mínimo.",
    "level": "intermediate",
    "tags": [
      "spending_control",
      "planning"
    ],
    "iconKey": "CreditCard",
    "color": "#72b6fd",
    "lessons": [
      {
        "id": "lesson_credit_card_basics",
        "order": 1,
        "title": "Lee una tarjeta de crédito antes de usarla",
        "description": "Entiende cupo, corte, vencimiento, cuota de manejo y la diferencia entre pago mínimo y total.",
        "estimatedMinutes": 5,
        "xpReward": 14,
        "skillTags": [
          "interpretar_extracto"
        ],
        "sources": [
          {
            "name": "Superintendencia Financiera — Educación al Consumidor Financiero",
            "url": "https://www.superfinanciera.gov.co/educacionSFC/"
          },
          {
            "name": "Superintendencia Financiera — Fecha de corte y pago de tarjeta",
            "url": "https://www.superfinanciera.gov.co/publicaciones/18693/normativaconceptos-y-jurisprudencia-conceptoshistorico-doctrina-y-conceptos-anteriores-superintendencias-bancaria-y-de-valores-doctrina-y-conceptos-financieros-indice-general-tarjeta-de-credito-18693/"
          },
          {
            "name": "CONDUSEF — Educación Financiera para Todos",
            "url": "https://www.condusef.gob.mx/index.php?idc=1873&idcat=3&p=contenido"
          }
        ],
        "steps": [
          {
            "id": "cc1_s1",
            "type": "content",
            "title": "La tarjeta es dinero prestado",
            "body": "Si tu cupo es $1.000.000 y compras $250.000, te quedan $750.000 de cupo antes de otros movimientos. El cupo no es ingreso adicional ni autoriza una compra fuera de presupuesto."
          },
          {
            "id": "cc1_s2",
            "type": "content",
            "title": "Corte, pago y costos no son lo mismo",
            "body": "La fecha de corte cierra un periodo de compras; la fecha límite indica cuándo debes pagar. El pago mínimo evita ciertas consecuencias inmediatas del impago, pero no equivale a cancelar la deuda; revisa también intereses y cuota de manejo contractual."
          },
          {
            "id": "cc1_s3",
            "type": "question",
            "title": "Interpreta el extracto",
            "body": "¿Qué harías si el extracto indica corte el día 8 y fecha límite de pago el día 24?",
            "skillTag": "interpretar_extracto",
            "options": [
              {
                "id": "a",
                "label": "Pagar a más tardar el 8 porque ese día vence la obligación.",
                "feedback": "El día 8 cierra el extracto; la fecha límite indicada para pagar es el 24."
              },
              {
                "id": "b",
                "label": "Revisar el total exigible y pagar dentro del plazo que vence el 24.",
                "feedback": "Correcto. El día 24 es la fecha límite, y pagar el saldo total aplicable evita dejar parte pendiente."
              },
              {
                "id": "c",
                "label": "Esperar al siguiente corte porque el pago mínimo mantiene la tarjeta disponible.",
                "feedback": "El mínimo no elimina el saldo pendiente ni garantiza ausencia de intereses."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "cc1_s4",
            "type": "question",
            "title": "Cupo disponible",
            "body": "¿Cuál sería tu cupo disponible si el cupo total es $900.000, debes $370.000 y no hay otros movimientos?",
            "skillTag": "interpretar_extracto",
            "options": [
              {
                "id": "a",
                "label": "$530.000.",
                "feedback": "Correcto: $900.000 − $370.000 = $530.000. Ese cupo no es dinero propio."
              },
              {
                "id": "b",
                "label": "$370.000.",
                "feedback": "Ese es el saldo utilizado, no el cupo disponible."
              },
              {
                "id": "c",
                "label": "$900.000.",
                "feedback": "El cupo total ya tiene parte comprometida."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "cc1_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Revisa en un extracto real o de ejemplo: corte, fecha de pago, total, mínimo, tasa y cuota de manejo. No registres datos de tarjetas en FinPath."
          },
          {
            "id": "cc1_s6",
            "type": "action",
            "title": "Practica sin endeudarte",
            "body": "Puedes usar un hábito de revisión de gastos; no necesitas una tarjeta real para aprender.",
            "optional": true,
            "options": [
              {
                "id": "template_cash_control_week",
                "label": "Revisar gastos cada noche"
              }
            ]
          }
        ],
        "pathId": "path_credit_cards"
      },
      {
        "id": "lesson_credit_rates_and_advances",
        "order": 2,
        "title": "Una cuota, varias cuotas y avances: calcula el costo",
        "description": "Diferencia tasa mensual y efectiva anual y suma comisiones antes de financiar.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "comparar_tasas"
        ],
        "sources": [
          {
            "name": "Superintendencia Financiera — Preguntas frecuentes sobre tasas",
            "url": "https://www.superfinanciera.gov.co/preguntas-frecuentes/12/12-tasas-de-interes/"
          },
          {
            "name": "Superintendencia Financiera — Educación al Consumidor Financiero",
            "url": "https://www.superfinanciera.gov.co/educacionSFC/"
          },
          {
            "name": "CONDUSEF — Educación Financiera para Todos",
            "url": "https://www.condusef.gob.mx/index.php?idc=1873&idcat=3&p=contenido"
          }
        ],
        "steps": [
          {
            "id": "cc2_s1",
            "type": "content",
            "title": "Una cuota no siempre cuesta lo mismo en todas las tarjetas",
            "body": "Algunas compras a una cuota pueden no generar interés corriente si cumples las condiciones del emisor y pagas según el contrato. En varias cuotas, verifica interés, plazo, cuota de manejo y costo total: nunca asumas que es gratis."
          },
          {
            "id": "cc2_s2",
            "type": "content",
            "title": "Tasas que no se comparan directamente",
            "body": "E.A. significa tasa efectiva anual y E.M. efectiva mensual. Una tasa hipotética de 2 % E.M. equivale aproximadamente a 26,82 % E.A. por capitalización; consulta el límite de usura vigente y su modalidad en la Superfinanciera."
          },
          {
            "id": "cc2_s3",
            "type": "question",
            "title": "El costo que suele omitirse",
            "body": "¿Cuál es la comparación más completa entre una compra a crédito y un avance de efectivo?",
            "skillTag": "comparar_tasas",
            "options": [
              {
                "id": "a",
                "label": "Comparar interés y comisiones de cada operación, además del plazo y costo total.",
                "feedback": "Correcto. Un avance puede cobrar comisión e intereses desde su realización, según el contrato."
              },
              {
                "id": "b",
                "label": "Comparar únicamente la tasa mensual anunciada.",
                "feedback": "Las comisiones y el momento desde el que se cobran intereses pueden cambiar mucho el costo."
              },
              {
                "id": "c",
                "label": "Comparar solo la cuota más pequeña.",
                "feedback": "Una cuota baja puede esconder un plazo largo o cargos adicionales."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "cc2_s4",
            "type": "question",
            "title": "Simulación de un avance",
            "body": "¿Cuál sería el saldo al final de un mes en un avance hipotético de $200.000, con comisión única de $12.000 e interés de 2 % mensual sobre los $200.000, sin pagos intermedios ni otros cargos?",
            "skillTag": "comparar_tasas",
            "options": [
              {
                "id": "a",
                "label": "$204.000.",
                "feedback": "Calculaste solo el interés de $4.000, pero falta la comisión de $12.000."
              },
              {
                "id": "b",
                "label": "$212.000.",
                "feedback": "Sumaste la comisión pero omitiste el interés del mes."
              },
              {
                "id": "c",
                "label": "$216.000.",
                "feedback": "Correcto: $200.000 + $12.000 + $4.000 = $216.000; es un ejemplo, no una tarifa bancaria."
              }
            ],
            "correctOptionId": "c"
          },
          {
            "id": "cc2_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Antes de financiar, compara tasa en la misma periodicidad, comisiones y monto total. Consulta la tasa de usura vigente en la web de la Superfinanciera."
          },
          {
            "id": "cc2_s6",
            "type": "action",
            "title": "Registra tus cuotas previstas",
            "body": "Planificar dinero para obligaciones ayuda a no confundir cupo con capacidad de pago.",
            "optional": true,
            "options": [
              {
                "id": "template_track_expenses_3_days",
                "label": "Registrar gastos durante 3 días"
              }
            ]
          }
        ],
        "pathId": "path_credit_cards"
      },
      {
        "id": "lesson_debt_strategy",
        "order": 3,
        "title": "Historial crediticio y un plan para salir de deudas",
        "description": "Compara avalancha y bola de nieve; entiende cuándo una deuda merece prioridad.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "priorizar_deudas"
        ],
        "sources": [
          {
            "name": "CFPB — Your Money, Your Goals",
            "url": "https://www.consumerfinance.gov/consumer-tools/educator-tool/your-money-your-goals/toolkit/"
          },
          {
            "name": "Superintendencia Financiera — Educación al Consumidor Financiero",
            "url": "https://www.superfinanciera.gov.co/educacionSFC/"
          },
          {
            "name": "CONDUSEF — Educación Financiera para Todos",
            "url": "https://www.condusef.gob.mx/index.php?idc=1873&idcat=3&p=contenido"
          }
        ],
        "steps": [
          {
            "id": "cc3_s1",
            "type": "content",
            "title": "El comportamiento de pago deja huella",
            "body": "Las centrales de información registran información crediticia conforme a las reglas aplicables. Pagar a tiempo importa: revisa fechas, extractos y tus reportes; una deuda para estudiar puede tener valor, pero no es automáticamente “buena” si su costo supera tu capacidad de pago."
          },
          {
            "id": "cc3_s2",
            "type": "content",
            "title": "Dos estrategias legítimas",
            "body": "Avalancha: pagas mínimos exigibles y destinas el excedente a la deuda de mayor tasa, para reducir intereses. Bola de nieve: con mínimos al día, priorizas el menor saldo para conseguir un cierre temprano; puede motivar, aunque no siempre minimiza intereses."
          },
          {
            "id": "cc3_s3",
            "type": "question",
            "title": "Qué estrategia estás aplicando",
            "body": "¿Qué estrategia sigues si pagas los mínimos de dos deudas y diriges todos los abonos extra a la de mayor tasa?",
            "skillTag": "priorizar_deudas",
            "options": [
              {
                "id": "a",
                "label": "Bola de nieve, porque desaparece primero el saldo más pequeño.",
                "feedback": "En bola de nieve la prioridad es el menor saldo, sin importar cuál tenga mayor tasa."
              },
              {
                "id": "b",
                "label": "Avalancha, porque priorizas el costo por intereses.",
                "feedback": "Correcto. La tasa más alta guía el excedente; hay que mantener al día las demás obligaciones."
              },
              {
                "id": "c",
                "label": "Refinanciación, porque combinas las dos cuotas.",
                "feedback": "Refinanciar implica cambiar las condiciones de un crédito, no solo priorizar abonos."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "cc3_s4",
            "type": "question",
            "title": "Compara intereses de un mes",
            "body": "¿Cuál deuda genera más interés en un mes, si no abonas capital: A de $500.000 al 2 % mensual o B de $300.000 al 4 % mensual?",
            "skillTag": "priorizar_deudas",
            "options": [
              {
                "id": "a",
                "label": "A genera $10.000 y B $12.000; B genera más.",
                "feedback": "Correcto. Aunque B tiene menor saldo, en este mes cuesta $2.000 más en interés."
              },
              {
                "id": "b",
                "label": "A genera más porque su saldo es mayor.",
                "feedback": "Un saldo mayor no asegura mayor interés: debe multiplicarse por la tasa respectiva."
              },
              {
                "id": "c",
                "label": "Ambas generan $10.000 porque tienen tasas cercanas.",
                "feedback": "A genera $10.000; B genera $12.000. Son supuestos simplificados."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "cc3_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Haz una tabla de saldos, tasas, mínimos y fechas. No tomes otro préstamo para cubrirlos sin comparar el costo total y las nuevas condiciones."
          },
          {
            "id": "cc3_s6",
            "type": "action",
            "title": "Si hoy tienes una deuda",
            "body": "Puedes registrar abonos en una meta, si ya sabes que caben en tu presupuesto.",
            "optional": true,
            "options": [
              {
                "id": "template_pay_debt_300k",
                "label": "Plan para abonar una deuda de $300.000"
              }
            ]
          }
        ],
        "pathId": "path_credit_cards"
      }
    ]
  },
  {
    "id": "path_grow_money",
    "title": "Haz crecer tu dinero",
    "description": "Entiende interés compuesto, instrumentos, liquidez, diversificación y prevención de estafas.",
    "level": "advanced",
    "tags": [
      "advanced_planning",
      "saving"
    ],
    "iconKey": "ChartNoAxesCombined",
    "color": "#003ea2",
    "lessons": [
      {
        "id": "lesson_compound_growth",
        "order": 1,
        "title": "Interés compuesto: gana rendimiento sobre rendimientos",
        "description": "Aprende a calcular crecimiento compuesto y el papel de los aportes constantes.",
        "estimatedMinutes": 5,
        "xpReward": 14,
        "skillTags": [
          "interes_compuesto"
        ],
        "sources": [
          {
            "name": "Investor.gov — Calculadora de interés compuesto",
            "url": "https://www.investor.gov/financial-tools-calculators/calculators/calculadora-de-interes-compuesto"
          },
          {
            "name": "Investor.gov — Introducción a la inversión",
            "url": "https://www.investor.gov/introduction-investing"
          },
          {
            "name": "AMV — Riesgos del mercado de valores",
            "url": "https://www.amvcolombia.org.co/attachments/data/ContenidosEducativos/2021/Cartilla_3/"
          }
        ],
        "steps": [
          {
            "id": "inv1_s1",
            "type": "content",
            "title": "Ahorrar e invertir no son lo mismo",
            "body": "Ahorrar prioriza disponibilidad y estabilidad para necesidades cercanas. Invertir busca un rendimiento potencial asumiendo riesgo; antes organiza presupuesto, reserva para emergencias y revisa deudas costosas."
          },
          {
            "id": "inv1_s2",
            "type": "content",
            "title": "Interés sobre interés",
            "body": "Supongamos $100.000 invertidos al 10 % anual constante, con reinversión, sin costos ni impuestos. Tras un año hay $110.000; al final del segundo, $121.000. Es una simulación, no una rentabilidad garantizada."
          },
          {
            "id": "inv1_s3",
            "type": "question",
            "title": "Simple o compuesto",
            "body": "¿Por qué al segundo año ganaste $11.000 y no $10.000 en el ejemplo anterior?",
            "skillTag": "interes_compuesto",
            "options": [
              {
                "id": "a",
                "label": "Porque el rendimiento se calculó también sobre los $10.000 del primer año.",
                "feedback": "Correcto. Reinvertir rendimientos aumenta la base sobre la que se calcula el siguiente periodo."
              },
              {
                "id": "b",
                "label": "Porque la tasa pasó automáticamente de 10 % a 11 %.",
                "feedback": "La tasa ilustrativa se mantuvo en 10 %; cambió la base de cálculo."
              },
              {
                "id": "c",
                "label": "Porque se añadieron aportes nuevos de $1.000.",
                "feedback": "No se hicieron aportes extra en el ejemplo."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "inv1_s4",
            "type": "question",
            "title": "Haz el cálculo",
            "body": "¿Cuánto tendrías después de dos años si colocas $200.000 al 5 % anual compuesto, sin aportes, cargos ni impuestos y con tasa hipotética constante?",
            "skillTag": "interes_compuesto",
            "options": [
              {
                "id": "a",
                "label": "$220.000.",
                "feedback": "Eso calcula interés simple de $10.000 por año; falta capitalizar el primero."
              },
              {
                "id": "b",
                "label": "$221.000.",
                "feedback": "Ese valor redondea de más: el cálculo exacto de este ejemplo da $220.500."
              },
              {
                "id": "c",
                "label": "$220.500.",
                "feedback": "Correcto: $200.000 × 1,05² = $220.500. Es solo un ejemplo matemático."
              }
            ],
            "correctOptionId": "c"
          },
          {
            "id": "inv1_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Repite el cálculo con una tasa ilustrativa distinta y agrega aportes mensuales en una calculadora. Nunca confundas un escenario con una promesa."
          },
          {
            "id": "inv1_s6",
            "type": "action",
            "title": "Primero fortalece tu reserva",
            "body": "Si aún no tienes fondo de emergencia, una meta de ahorro disponible puede ser más útil que empezar a invertir.",
            "optional": true,
            "options": [
              {
                "id": "template_emergency_120k",
                "label": "Armar fondo de emergencia de $120.000"
              }
            ]
          }
        ],
        "pathId": "path_grow_money"
      },
      {
        "id": "lesson_risk_liquidity",
        "order": 2,
        "title": "Riesgo, liquidez y qué cubre Fogafín",
        "description": "Evalúa el plazo de una meta y distingue depósitos protegidos de inversiones con riesgo.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "riesgo_liquidez"
        ],
        "sources": [
          {
            "name": "Fogafín — Qué es el Seguro de Depósitos",
            "url": "https://www.fogafin.gov.co/que-es-el-seguro-de-depositos"
          },
          {
            "name": "AMV — Riesgos del mercado de valores",
            "url": "https://www.amvcolombia.org.co/attachments/data/ContenidosEducativos/2021/Cartilla_3/"
          },
          {
            "name": "Investor.gov — Introducción a la inversión",
            "url": "https://www.investor.gov/introduction-investing"
          }
        ],
        "steps": [
          {
            "id": "inv2_s1",
            "type": "content",
            "title": "Tres criterios antes de mover tu dinero",
            "body": "Rentabilidad es lo que podrías ganar; riesgo es la posibilidad de perder o no obtener lo esperado; liquidez es qué tan fácil accedes al dinero. Para emergencias cercanas, acceso y seguridad importan especialmente."
          },
          {
            "id": "inv2_s2",
            "type": "content",
            "title": "El nombre del producto no basta",
            "body": "Ciertas cuentas de depósito y certificados de depósito a término (CDT) de entidades inscritas están protegidos por el Seguro de Depósitos de Fogafín, dentro de sus condiciones. Un fondo de inversión colectiva reúne aportes para invertir y no tiene esa protección; verifica siempre el producto y la entidad."
          },
          {
            "id": "inv2_s3",
            "type": "classify",
            "title": "Elige la característica",
            "body": "Clasifica qué aspecto importa más en cada situación. Ninguna opción promete una inversión libre de riesgo ¿A qué categoría corresponde cada caso?",
            "skillTag": "riesgo_liquidez",
            "categories": [
              {
                "id": "liquidez",
                "label": "Acceso al dinero"
              },
              {
                "id": "riesgo",
                "label": "Posibilidad de pérdida"
              },
              {
                "id": "rentabilidad",
                "label": "Ganancia esperada"
              }
            ],
            "items": [
              {
                "id": "i1",
                "label": "Necesitas retirar tu reserva médica el mismo día.",
                "correctCategoryId": "liquidez",
                "feedback": "La rapidez de acceso es el atributo crítico para esta meta."
              },
              {
                "id": "i2",
                "label": "El valor de tu inversión puede caer antes de venderla.",
                "correctCategoryId": "riesgo",
                "feedback": "Una pérdida potencial del capital es riesgo."
              },
              {
                "id": "i3",
                "label": "Comparas cuánto se espera recibir al finalizar un plazo.",
                "correctCategoryId": "rentabilidad",
                "feedback": "Se está analizando el rendimiento esperado, no su certeza."
              },
              {
                "id": "i4",
                "label": "Retirar antes del vencimiento implica perder beneficios o no estar permitido.",
                "correctCategoryId": "liquidez",
                "feedback": "Las condiciones de retiro limitan la disponibilidad del dinero."
              }
            ]
          },
          {
            "id": "inv2_s4",
            "type": "question",
            "title": "Ganancia ilustrativa",
            "body": "¿Cuánto interés bruto obtendrías sobre $500.000 a una tasa hipotética de 1 % para un único mes, sin capitalización ni cargos?",
            "skillTag": "riesgo_liquidez",
            "options": [
              {
                "id": "a",
                "label": "$5.000.",
                "feedback": "Correcto: $500.000 × 0,01 = $5.000. La comparación real exige revisar comisiones e impuestos."
              },
              {
                "id": "b",
                "label": "$50.000.",
                "feedback": "Eso sería 10 % de $500.000, no 1 %."
              },
              {
                "id": "c",
                "label": "$500.",
                "feedback": "Eso corresponde a 0,1 % del capital."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "inv2_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Antes de elegir un instrumento, anota plazo, acceso, posibles pérdidas, cargos y vigilancia. Revisa directamente en Fogafín si el producto está cubierto."
          },
          {
            "id": "inv2_s6",
            "type": "action",
            "title": "Mantén disponible lo indispensable",
            "body": "Una reserva para imprevistos puede registrarse como meta de ahorro, sin seleccionar ninguna inversión.",
            "optional": true,
            "options": [
              {
                "id": "template_emergency_120k",
                "label": "Crear reserva accesible"
              }
            ]
          }
        ],
        "pathId": "path_grow_money"
      },
      {
        "id": "lesson_diversification_fraud",
        "order": 3,
        "title": "Diversifica y reconoce señales de una pirámide",
        "description": "Entiende concentración, horizonte y señales de ofertas fraudulentas.",
        "estimatedMinutes": 5,
        "xpReward": 12,
        "skillTags": [
          "detectar_fraudes"
        ],
        "sources": [
          {
            "name": "AMV — Riesgos del mercado de valores",
            "url": "https://www.amvcolombia.org.co/attachments/data/ContenidosEducativos/2021/Cartilla_3/"
          },
          {
            "name": "Investor.gov — Distribución y diversificación de activos",
            "url": "https://www.investor.gov/introduction-investing/getting-started/asset-allocation"
          },
          {
            "name": "Investor.gov — Alertas de fraude de inversiones",
            "url": "https://www.investor.gov/protect-your-investments/fraud/how-avoid-fraud/red-flags-investment-fraud-checklist"
          },
          {
            "name": "Superintendencia Financiera — Educación al Consumidor Financiero",
            "url": "https://www.superfinanciera.gov.co/educacionSFC/"
          }
        ],
        "steps": [
          {
            "id": "inv3_s1",
            "type": "content",
            "title": "Diversificar no elimina el riesgo",
            "body": "Concentrar todo en una sola empresa o activo expone a una caída específica. Diversificar reparte exposiciones entre instrumentos; tu horizonte (cuándo usarás el dinero), costos y liquidez también importan."
          },
          {
            "id": "inv3_s2",
            "type": "content",
            "title": "Mucho rendimiento sin riesgo es una alerta",
            "body": "Desconfía de ganancias “garantizadas” extraordinarias, presión para entrar hoy y pagos ligados a traer personas. Antes de invertir, verifica autorización y vigilancia del intermediario en fuentes oficiales; una página atractiva no prueba legitimidad."
          },
          {
            "id": "inv3_s3",
            "type": "question",
            "title": "La señal más preocupante",
            "body": "¿Qué oferta exige mayor cautela antes de entregar tu dinero?",
            "skillTag": "detectar_fraudes",
            "options": [
              {
                "id": "a",
                "label": "Un producto que explica escenarios de pérdidas y cobra una comisión visible.",
                "feedback": "El riesgo informado y las comisiones deben evaluarse, pero no son por sí mismos evidencia de fraude."
              },
              {
                "id": "b",
                "label": "Una plataforma que promete ganancia alta fija y exige invitar a tres conocidos para cobrar.",
                "feedback": "Correcto. Combina una promesa incompatible con la incertidumbre de inversión y un incentivo de captación."
              },
              {
                "id": "c",
                "label": "Una inversión que aclara que podrías no alcanzar la rentabilidad esperada.",
                "feedback": "Advertir riesgos es coherente con inversiones legítimas, aunque todavía hay que verificar el intermediario."
              }
            ],
            "correctOptionId": "b"
          },
          {
            "id": "inv3_s4",
            "type": "question",
            "title": "Cuantifica la concentración",
            "body": "¿Cuánto perderías si colocas $600.000 en un solo activo que cae 25 %, sin considerar impuestos ni recuperación posterior?",
            "skillTag": "detectar_fraudes",
            "options": [
              {
                "id": "a",
                "label": "$150.000.",
                "feedback": "Correcto: $600.000 × 0,25 = $150.000. Diversificar puede reducir concentración, pero no garantiza evitar pérdidas."
              },
              {
                "id": "b",
                "label": "$25.000.",
                "feedback": "Confundiste el porcentaje con una cantidad fija de pesos."
              },
              {
                "id": "c",
                "label": "$450.000.",
                "feedback": "Ese sería el valor restante después de la caída, no la pérdida."
              }
            ],
            "correctOptionId": "a"
          },
          {
            "id": "inv3_s5",
            "type": "final",
            "title": "Lo que te llevas",
            "body": "Esta semana aprende a consultar entidades vigiladas y describe tres alertas de fraude. No inviertas dinero de emergencias ni aceptes promesas de rentabilidad segura."
          },
          {
            "id": "inv3_s6",
            "type": "action",
            "title": "Seguridad primero",
            "body": "Puedes crear un hábito de revisar y registrar decisiones antes de comprometer dinero.",
            "optional": true,
            "options": [
              {
                "id": "template_financial_check_5days",
                "label": "Revisar decisiones financieras durante 5 días"
              }
            ]
          }
        ],
        "pathId": "path_grow_money"
      }
    ]
  }
];

export const PREMIUM_CONFIG = {
  monthlyPrice: 9000,
  currency: "COP",
  periodLabel: "30 días",
  renewalLabel: "Sin renovación automática durante la prueba",
  freeFeatures: [
    "Diagnóstico financiero",
    "Rutas básicas de aprendizaje",
    "Creación y seguimiento de metas",
    "Simuladores guiados limitados"
  ],
  premiumFeatures: [
    "Radiografía financiera completa y actualizable (ingresos, gastos y metas)",
    "Rutas avanzadas y casos de práctica adicionales",
    "Reporte mensual de tu progreso",
    "Simuladores avanzados"
  ]
};

export const SIMULATORS = [
  {
    id: "micro_expenses",
    title: "Gastos hormiga",
    description: "Descubre cuánto representan pequeños gastos repetidos en un mes y un año.",
    iconKey: "Coffee"
  },
  {
    id: "savings_goal",
    title: "Meta de ahorro",
    description: "Estima cuánto tiempo necesitas para alcanzar una meta con aportes periódicos.",
    iconKey: "PiggyBank"
  },
  {
    id: "small_debt",
    title: "Deuda pequeña",
    description: "Explora cómo una cuota mensual afecta el tiempo aproximado de pago.",
    iconKey: "CreditCard"
  },
  {
    id: "weekly_budget",
    title: "Presupuesto semanal",
    description: "Compara tus ingresos y gastos para visualizar un saldo disponible.",
    iconKey: "ChartNoAxesColumnIncreasing"
  }
];

export const LESSON_ANSWER_KEYS = {
  "l1_s3": "a",
  "l1_s4": "a",
  "l2_s4": "b",
  "l3_s3": "b",
  "l3_s4": "a",
  "b1_s3": "c",
  "b1_s4": "a",
  "b2_s4": "b",
  "b3_s3": "a",
  "b3_s4": "b",
  "d1_s3": "b",
  "d1_s4": "c",
  "d2_s3": "a",
  "d2_s4": "b",
  "d3_s3": "c",
  "d3_s4": "a",
  "cc1_s3": "b",
  "cc1_s4": "a",
  "cc2_s3": "a",
  "cc2_s4": "c",
  "cc3_s3": "b",
  "cc3_s4": "a",
  "inv1_s3": "a",
  "inv1_s4": "c",
  "inv2_s4": "a",
  "inv3_s3": "b",
  "inv3_s4": "a"
};

export const ADAPTIVE_PRACTICE = {
  "lesson_where_money_goes": {
    "title": "Refuerzo: gasto repetido",
    "prompt": "¿Cuánto suman $8.000 de transporte adicional tres veces por semana durante cuatro semanas?",
    "skillTag": "gastos_recurrentes",
    "options": [
      {
        "id": "a",
        "label": "$96.000.",
        "feedback": "Correcto: $8.000 × 3 × 4 = $96.000; conocerlo ayuda a decidir si puedes ajustarlo."
      },
      {
        "id": "b",
        "label": "$32.000.",
        "feedback": "Ese valor supone una vez por semana; el caso indica tres."
      },
      {
        "id": "c",
        "label": "$120.000.",
        "feedback": "Eso sería cinco semanas; el periodo indicado es de cuatro."
      }
    ],
    "correctOptionId": "a",
    "insight": "Cuenta repeticiones y periodos antes de decidir qué cambiar."
  },
  "lesson_needs_wants": {
    "title": "Refuerzo: necesidad y modo de compra",
    "prompt": "¿Qué conclusión es más precisa si necesitas zapatos para prácticas, pero compras sin comparar los más costosos por un anuncio urgente?",
    "skillTag": "priorizar_gastos",
    "options": [
      {
        "id": "a",
        "label": "Todo el gasto es un deseo porque hubo publicidad.",
        "feedback": "Necesitar zapatos puede ser real; la urgencia afecta la forma de decidir."
      },
      {
        "id": "b",
        "label": "La necesidad es real, pero la compra pudo ser impulsiva y más cara de lo necesario.",
        "feedback": "Correcto. Prioridad y comportamiento de compra se analizan por separado."
      },
      {
        "id": "c",
        "label": "Es una compra necesaria, así que cualquier precio está justificado.",
        "feedback": "La necesidad no elimina la obligación de revisar precio y presupuesto."
      }
    ],
    "correctOptionId": "b",
    "insight": "Identifica qué es indispensable y qué parte del gasto depende de la alternativa elegida."
  },
  "lesson_first_small_goal": {
    "title": "Refuerzo: meta SMART viable",
    "prompt": "¿Qué aporte semanal permite reunir $96.000 en ocho semanas desde cero?",
    "skillTag": "plan_ahorro",
    "options": [
      {
        "id": "a",
        "label": "$8.000.",
        "feedback": "Ahorrarías $64.000, faltan $32.000."
      },
      {
        "id": "b",
        "label": "$16.000.",
        "feedback": "Llegarías en seis semanas; es más de lo exigido para el plazo."
      },
      {
        "id": "c",
        "label": "$12.000.",
        "feedback": "Correcto: $96.000 ÷ 8 = $12.000 por semana."
      }
    ],
    "correctOptionId": "c",
    "insight": "Descompón el monto objetivo en aportes que puedas sostener."
  },
  "lesson_budget_intro": {
    "title": "Refuerzo: neto frente a bruto",
    "prompt": "¿Cuánto puedes presupuestar si te anuncian $950.000 de ingreso bruto y te descuentan $70.000 antes de recibirlo?",
    "skillTag": "ingreso_disponible",
    "options": [
      {
        "id": "a",
        "label": "$880.000.",
        "feedback": "Correcto: el ingreso neto es $950.000 menos $70.000."
      },
      {
        "id": "b",
        "label": "$950.000.",
        "feedback": "Es el bruto, no el disponible."
      },
      {
        "id": "c",
        "label": "$1.020.000.",
        "feedback": "Sumaste deducciones en lugar de restarlas."
      }
    ],
    "correctOptionId": "a",
    "insight": "Las decisiones deben partir del ingreso que realmente recibes."
  },
  "lesson_fixed_variable": {
    "title": "Refuerzo: gastos que no son mensuales",
    "prompt": "¿Cuánto apartas cada mes para un pago semestral previsto de $240.000, empezando desde cero?",
    "skillTag": "clasificar_gastos",
    "options": [
      {
        "id": "a",
        "label": "$20.000.",
        "feedback": "Ese valor lo repartiría en doce meses, no seis."
      },
      {
        "id": "b",
        "label": "$40.000.",
        "feedback": "Correcto: $240.000 ÷ 6 = $40.000 por mes."
      },
      {
        "id": "c",
        "label": "$60.000.",
        "feedback": "Llegarías en cuatro meses, antes del plazo del caso."
      }
    ],
    "correctOptionId": "b",
    "insight": "Un gasto infrecuente pero previsible se puede financiar mes a mes."
  },
  "lesson_budget_review": {
    "title": "Refuerzo: un ajuste concreto",
    "prompt": "¿Cuánto debes reasignar si planeaste $120.000 en alimentación y gastaste $138.000, manteniendo los mismos ingresos?",
    "skillTag": "revision_presupuesto",
    "options": [
      {
        "id": "a",
        "label": "$18.000.",
        "feedback": "Correcto: el exceso es $138.000 − $120.000 = $18.000; busca una categoría disponible."
      },
      {
        "id": "b",
        "label": "$12.000.",
        "feedback": "No coincide con la diferencia real entre plan y gasto."
      },
      {
        "id": "c",
        "label": "$138.000.",
        "feedback": "Ese fue el gasto total, no la desviación."
      }
    ],
    "correctOptionId": "a",
    "insight": "Revisar presupuestos es medir diferencias y decidir ajustes factibles."
  },
  "lesson_opportunity_cost": {
    "title": "Refuerzo: una elección con alternativa",
    "prompt": "¿Cuál es tu costo de oportunidad si usas $70.000 en una cena y la mejor alternativa descartada era comprar materiales para un curso?",
    "skillTag": "costo_oportunidad",
    "options": [
      {
        "id": "a",
        "label": "Solo los $70.000 en efectivo, sin relación con otras opciones.",
        "feedback": "Ese es el desembolso, no el beneficio alternativo sacrificado."
      },
      {
        "id": "b",
        "label": "El beneficio de los materiales del curso a los que renuncias.",
        "feedback": "Correcto: el concepto se refiere a la mejor alternativa que no eliges."
      },
      {
        "id": "c",
        "label": "Todas las otras compras imaginables.",
        "feedback": "La referencia es la mejor alternativa descartada, no una suma hipotética infinita."
      }
    ],
    "correctOptionId": "b",
    "insight": "Valorar alternativas evita juzgar decisiones solo por el dinero gastado."
  },
  "lesson_wait_or_buy": {
    "title": "Refuerzo: descuentos y anclaje",
    "prompt": "¿Qué precio final tiene una mochila de $180.000 con una rebaja hipotética de 15 %, antes de decidir si la necesitas?",
    "skillTag": "sesgos_consumo",
    "options": [
      {
        "id": "a",
        "label": "$165.000.",
        "feedback": "Son $15.000 menos, no el 15 % del precio."
      },
      {
        "id": "b",
        "label": "$153.000.",
        "feedback": "Correcto: el descuento es $27.000; el precio final es $153.000."
      },
      {
        "id": "c",
        "label": "$27.000.",
        "feedback": "Ese es el valor del descuento, no el precio final."
      }
    ],
    "correctOptionId": "b",
    "insight": "Calcula el precio final y después evalúa la necesidad, no al revés."
  },
  "lesson_compare_before_spending": {
    "title": "Refuerzo: costo total de financiación",
    "prompt": "¿Qué pago es menor para el mismo curso: $360.000 al contado o cuatro cuotas de $85.000 con comisión única de $30.000?",
    "skillTag": "costo_total",
    "options": [
      {
        "id": "a",
        "label": "Contado, porque las cuotas suman $370.000 con comisión.",
        "feedback": "Correcto: 4 × $85.000 + $30.000 = $370.000, $10.000 más que contado."
      },
      {
        "id": "b",
        "label": "Cuotas, porque cada una es menor que $360.000.",
        "feedback": "La cuota no muestra el costo total: suma las cuatro y la comisión."
      },
      {
        "id": "c",
        "label": "Son iguales, porque la comisión se paga una sola vez.",
        "feedback": "Ser única no elimina la comisión del costo final."
      }
    ],
    "correctOptionId": "a",
    "insight": "Compara precios totales y cargos; una cuota baja puede ocultar costo."
  },
  "lesson_credit_card_basics": {
    "title": "Refuerzo: mínimo frente al total",
    "prompt": "¿Qué deja pendiente en una tarjeta si el extracto exige $280.000 en total y pagas solo $70.000 de mínimo, sin nuevos cargos?",
    "skillTag": "interpretar_extracto",
    "options": [
      {
        "id": "a",
        "label": "$0: pagar el mínimo liquida el extracto.",
        "feedback": "El pago mínimo no liquida todo el saldo."
      },
      {
        "id": "b",
        "label": "$70.000: ese es el valor de la deuda.",
        "feedback": "Es el abono, no el saldo pendiente."
      },
      {
        "id": "c",
        "label": "$210.000 antes de intereses o cargos posteriores.",
        "feedback": "Correcto: $280.000 − $70.000 = $210.000 pendientes."
      }
    ],
    "correctOptionId": "c",
    "insight": "El mínimo puede prevenir ciertos incumplimientos, pero deja deuda."
  },
  "lesson_credit_rates_and_advances": {
    "title": "Refuerzo: comisión más interés",
    "prompt": "¿Cuál es el costo adicional de un avance hipotético de $100.000 con comisión de $8.000 y 3 % de interés por un mes sobre el principal, sin otros cargos?",
    "skillTag": "comparar_tasas",
    "options": [
      {
        "id": "a",
        "label": "$11.000.",
        "feedback": "Correcto: $8.000 + $3.000 de interés = $11.000 de costo, aparte del principal."
      },
      {
        "id": "b",
        "label": "$8.000.",
        "feedback": "Faltó sumar el interés de $3.000."
      },
      {
        "id": "c",
        "label": "$3.000.",
        "feedback": "Contaste intereses pero no comisión."
      }
    ],
    "correctOptionId": "a",
    "insight": "La tasa anunciada no explica por sí sola el costo efectivo de una operación."
  },
  "lesson_debt_strategy": {
    "title": "Refuerzo: estrategia de pago",
    "prompt": "¿Qué deuda priorizas en avalancha si tienes A con $100.000 al 4 % mensual y B con $300.000 al 2 % mensual, y pagas ambos mínimos?",
    "skillTag": "priorizar_deudas",
    "options": [
      {
        "id": "a",
        "label": "B porque tiene saldo más grande.",
        "feedback": "Avalancha prioriza tasa, no saldo; B sería candidato solo bajo otras condiciones."
      },
      {
        "id": "b",
        "label": "A porque cobra 4 % mensual, la tasa más alta.",
        "feedback": "Correcto. El excedente va a la deuda de tasa mayor mientras mantienes los mínimos de ambas."
      },
      {
        "id": "c",
        "label": "La que venza después, aunque tenga tasa menor.",
        "feedback": "La fecha afecta mora, pero después de cubrir mínimos, avalancha ordena por tasa."
      }
    ],
    "correctOptionId": "b",
    "insight": "La tasa guía avalancha; el menor saldo guía bola de nieve."
  },
  "lesson_compound_growth": {
    "title": "Refuerzo: capitalización",
    "prompt": "¿Cuánto tendrías al final de dos años con $50.000 al 10 % anual hipotético compuesto y sin otros movimientos ni costos?",
    "skillTag": "interes_compuesto",
    "options": [
      {
        "id": "a",
        "label": "$60.000.",
        "feedback": "Es interés simple: $5.000 por año, sin capitalizar el primero."
      },
      {
        "id": "b",
        "label": "$60.500.",
        "feedback": "Correcto: $50.000 × 1,1² = $60.500."
      },
      {
        "id": "c",
        "label": "$55.000.",
        "feedback": "Es el saldo después del primer año, falta el segundo."
      }
    ],
    "correctOptionId": "b",
    "insight": "Capitalizar es aplicar la nueva tasa al saldo que ya ganó rendimientos."
  },
  "lesson_risk_liquidity": {
    "title": "Refuerzo: elegir por horizonte",
    "prompt": "¿Qué pesa más si debes pagar una matrícula dentro de dos semanas y necesitas que el dinero esté disponible?",
    "skillTag": "riesgo_liquidez",
    "options": [
      {
        "id": "a",
        "label": "Mayor rentabilidad potencial aunque no puedas retirar por meses.",
        "feedback": "La falta de acceso puede impedir cumplir una obligación cercana."
      },
      {
        "id": "b",
        "label": "Una promesa de rendimiento alto sin información de riesgo.",
        "feedback": "No hay inversión garantizada por una promesa; la urgencia requiere prudencia."
      },
      {
        "id": "c",
        "label": "Disponibilidad y protección del capital para el pago próximo.",
        "feedback": "Correcto. Plazo corto y obligación cierta hacen prioritarios seguridad y liquidez."
      }
    ],
    "correctOptionId": "c",
    "insight": "El instrumento se elige según plazo y necesidad de acceso."
  },
  "lesson_diversification_fraud": {
    "title": "Refuerzo: alerta de intermediarios",
    "prompt": "¿Cuál conducta te protege más antes de invertir si alguien promete rendimientos fijos altos y exige decidir hoy?",
    "skillTag": "detectar_fraudes",
    "options": [
      {
        "id": "a",
        "label": "Verificar la entidad en registros oficiales, revisar riesgos y no ceder a la urgencia.",
        "feedback": "Correcto. Autoridad, transparencia y tiempo para comparar son verificaciones básicas."
      },
      {
        "id": "b",
        "label": "Invertir poco para comprobar si paga durante la primera semana.",
        "feedback": "Pagos iniciales no prueban sostenibilidad ni legitimidad de un esquema."
      },
      {
        "id": "c",
        "label": "Confiar si publica testimonios y capturas de pagos.",
        "feedback": "Los testimonios pueden manipularse; verifica la situación legal."
      }
    ],
    "correctOptionId": "a",
    "insight": "Una inversión legítima requiere entender qué compras y a quién entregas el dinero."
  }
};


export const SKILL_CHECKS = {
  "pre": [
    {
      "type": "question",
      "title": "Diagnóstico práctico: presupuesto",
      "body": "¿Cuál es el saldo libre si recibes $800.000 netos, gastas $480.000 en obligaciones, $130.000 en necesidades variables y separas $90.000 para ahorro?",
      "skillTag": "presupuesto_saldo",
      "options": [
        {
          "id": "a",
          "label": "$190.000.",
          "feedback": "Omitiste el ahorro: también debe restarse del dinero sin asignar."
        },
        {
          "id": "b",
          "label": "$100.000.",
          "feedback": "Correcto: $800.000 − $480.000 − $130.000 − $90.000 = $100.000."
        },
        {
          "id": "c",
          "label": "$230.000.",
          "feedback": "Esa diferencia no considera todas las asignaciones del enunciado."
        }
      ],
      "correctOptionId": "b",
      "id": "skill_pre_1"
    },
    {
      "type": "question",
      "title": "Diagnóstico práctico: emergencia",
      "body": "¿Qué harías con $80.000 apartados para reparar la moto si una compra no urgente requiere $60.000?",
      "skillTag": "emergencia_priorizacion",
      "options": [
        {
          "id": "a",
          "label": "Usar la reserva y recuperarla si después sobra dinero.",
          "feedback": "Es una salida tentadora, pero la reserva queda expuesta a un imprevisto real."
        },
        {
          "id": "b",
          "label": "Poner el fondo en una inversión de retiro restringido mientras llega la reparación.",
          "feedback": "Podría impedir el acceso a dinero urgente."
        },
        {
          "id": "c",
          "label": "Conservar la reserva y planear la compra con otro monto o plazo.",
          "feedback": "Correcto. Separa emergencias de deseos planeables, sin descartar estos últimos."
        }
      ],
      "correctOptionId": "c",
      "id": "skill_pre_2"
    },
    {
      "type": "question",
      "title": "Diagnóstico práctico: crédito",
      "body": "¿Cuál es el costo total de un artículo con cuatro cuotas de $95.000 y comisión única de $20.000, sin otros costos?",
      "skillTag": "costo_credito",
      "options": [
        {
          "id": "a",
          "label": "$400.000.",
          "feedback": "Correcto: $95.000 × 4 + $20.000 = $400.000."
        },
        {
          "id": "b",
          "label": "$380.000.",
          "feedback": "Ese es el valor de las cuotas; falta la comisión."
        },
        {
          "id": "c",
          "label": "$115.000.",
          "feedback": "Sumaste solo una cuota con la comisión, no las cuatro."
        }
      ],
      "correctOptionId": "a",
      "id": "skill_pre_3"
    }
  ],
  "post": [
    {
      "type": "question",
      "title": "Evaluación práctica: presupuesto",
      "body": "¿Cuál es el saldo libre si recibes $950.000 netos, asignas $520.000 a obligaciones, $170.000 a variables necesarios y $110.000 a una meta?",
      "skillTag": "presupuesto_saldo",
      "options": [
        {
          "id": "a",
          "label": "$260.000.",
          "feedback": "Olvidaste descontar los $110.000 destinados a la meta."
        },
        {
          "id": "b",
          "label": "$150.000.",
          "feedback": "Correcto: $950.000 − $520.000 − $170.000 − $110.000 = $150.000."
        },
        {
          "id": "c",
          "label": "$320.000.",
          "feedback": "No corresponde al total de gastos y meta asignados."
        }
      ],
      "correctOptionId": "b",
      "id": "skill_post_1"
    },
    {
      "type": "question",
      "title": "Evaluación práctica: emergencia",
      "body": "¿Qué harías con una reserva de $110.000 si aparece una suscripción anual no esencial de $90.000?",
      "skillTag": "emergencia_priorizacion",
      "options": [
        {
          "id": "a",
          "label": "Conservar la reserva y crear una partida para esa suscripción si vale la pena.",
          "feedback": "Correcto. Una suscripción previsible no se debe confundir con un imprevisto urgente."
        },
        {
          "id": "b",
          "label": "Pagarla con la reserva porque el cobro ocurre solo una vez al año.",
          "feedback": "Su periodicidad no la convierte en emergencia."
        },
        {
          "id": "c",
          "label": "Bloquear la reserva en un producto a largo plazo para no tentarte a usarla.",
          "feedback": "Dificultaría el acceso cuando llegue una emergencia auténtica."
        }
      ],
      "correctOptionId": "a",
      "id": "skill_post_2"
    },
    {
      "type": "question",
      "title": "Evaluación práctica: crédito",
      "body": "¿Cuál es el costo total de un producto con cinco cuotas de $82.000 y comisión única de $15.000, sin otros costos?",
      "skillTag": "costo_credito",
      "options": [
        {
          "id": "a",
          "label": "$410.000.",
          "feedback": "Es la suma de cuotas; falta la comisión."
        },
        {
          "id": "b",
          "label": "$425.000.",
          "feedback": "Correcto: $82.000 × 5 + $15.000 = $425.000."
        },
        {
          "id": "c",
          "label": "$97.000.",
          "feedback": "Sumaste una cuota con la comisión, no cinco."
        }
      ],
      "correctOptionId": "b",
      "id": "skill_post_3"
    }
  ]
};
