export default {
  feedback: {
    title: "Обратная связь",
    inputLabel: "Ваш отзыв",
    send: "Отправить",
    sending: "Отправка...",
    delete: "Удалить",
    deleting: "Удаление...",
    cancel: "Отмена",
    errorLoading: "Не удалось загрузить отзывы",
    loginPrompt: "Для отправки отзыва необходимо войти в систему.",
    allFeedback: "Все отзывы",
    myFeedback: "Мои отзывы",
    showMyFeedback: "Показать мои отзывы",
    hideMyFeedback: "Скрыть мои отзывы",
    deleteConfirmTitle: "Подтверждение удаления",
    deleteConfirmMessage: "Вы уверены, что хотите удалить этот отзыв?",
    loading: "Загрузка...",
  },
  home: {
    welcome: "Добро пожаловать",
    guest: "гость",
    subtitle:
      "Всё о безопасности на спортивных объектах — просто, удобно и наглядно.",
    getStarted: "С чего начать",
    step1: "Ознакомьтесь с мерами безопасности.",
    step2: "Пройдите обучающие тренинги.",
    step3: "Посмотрите статистику и достижения.",
    quote: "Мы не просто обучаем. Мы формируем культуру безопасности в спорте.",
    quoteAuthor: "Руководитель отдела охраны труда",
    contactUs: "Связаться с нами",
  },
  resources: {
    title: "Полезные ресурсы",
    description:
      "На этой странице собраны полезные материалы и ссылки, которые помогут вам в различных ситуациях.",
    sections: [
      {
        title: "Нормативные документы",
        icon: "📄",
        items: [
          { text: "Федеральные законы", url: "#" },
          { text: "Региональные нормативы", url: "#" },
          { text: "Технические регламенты", url: "#" },
        ],
      },
      {
        title: "Экстренная помощь",
        icon: "🆘",
        items: [
          { text: "Служба спасения: 112", url: "#" },
          { text: "Психологическая помощь", url: "#" },
          { text: "Ближайшие медицинские учреждения", url: "#" },
        ],
      },
      {
        title: "Рекомендации по безопасности",
        icon: "🔒",
        items: [
          { text: "Безопасность дома", url: "#" },
          { text: "Кибербезопасность", url: "#" },
          { text: "Первая помощь", url: "#" },
        ],
      },
    ],
  },
  auth: {
    login: "Вход",
    register: "Регистрация",
  },
  login: {
    title: "Вход",
    email: "Электронная почта",
    password: "Пароль",
    requiredField: "Это поле обязательно",
    invalidCredentials: "Неверный email или пароль",
    genericError: "Произошла ошибка при входе",
    submit: "Войти",
    loggingIn: "Вход...",
    imageAlt: "Иллюстрация входа",
    forgotPassword: "Забыли пароль?",
    resetPasswordTitle: "Сбросить пароль",
    resetEmailSent:
      "Инструкции по сбросу пароля отправлены на ваш адрес электронной почты",
    sendResetLink: "Отправить ссылку для сброса",
    resetError: "Ошибка отправки ссылки для сброса",
    cancel: "Отмена",
  },

  register: {
    title: "Регистрация",
    username: "Имя пользователя",
    email: "Электронная почта",
    password: "Пароль",
    confirmPassword: "Подтверждение пароля",
    requiredField: "Обязательное поле",
    invalidEmail: "Пожалуйста, введите корректный email",
    passwordRequirements:
      "Пароль должен содержать минимум 8 символов, включая буквы и цифры",
    passwordsMismatch: "Пароли не совпадают",
    submit: "Зарегистрироваться",
    loading: "Регистрация...",
    genericError: "Ошибка регистрации. Пожалуйста, попробуйте снова.",
    success: "Регистрация успешно завершена!",
    enterVerificationCode: "Введите код подтверждения",
    verifyCode: "Подтвердить код",
    enterCodeError: "Пожалуйста, введите код подтверждения",
    invalidCode: "Неверный код подтверждения",
    verificationFailed: "Ошибка проверки кода",
    emailConfirmationTitle: "Подтвержение почты",
    emailSentMessage: "Код отправлен",
    resendCode: "Повторная отправка",
  },
  navbar: {
    home: "Главная",
    safety: "Меры безопасности",
    training: "Обучение",
    resources: "Ресурсы",
    feedback: "Обратная связь",
    logout: "Выйти",
    login: "Войти",
    title: "Спортивные сооружения",
  },
  safetyMeasuresText: {
    title: "Меры безопасности",
    description:
      "Наша организация уделяет особое внимание безопасности на всех уровнях. Мы стремимся создать безопасную среду для наших сотрудников, клиентов и окружающей среды. Ниже представлены основные меры, которые мы применяем для обеспечения безопасности, а также дополнительные инициативы и статистика, демонстрирующие наши достижения.",
    sections: [
      {
        title: "Физическая безопасность",

        content: {
          description:
            "Обеспечение физической безопасности включает в себя охрану территории, контроль доступа, установку систем видеонаблюдения и регулярные проверки безопасности. Мы также внедряем инновационные технологии для повышения уровня защиты.",
          list: [
            "Круглосуточная охрана территории с использованием современных систем мониторинга.",
            "Контроль доступа с использованием биометрических данных и электронных пропусков.",
            "Системы видеонаблюдения с функцией распознавания лиц и аналитикой в реальном времени.",
            "Регулярные тренировки по действиям в чрезвычайных ситуациях, включая отработку сценариев террористических угроз.",
            "Установка металлодетекторов и сканеров на входах в здания.",
            "Сотрудничество с местными правоохранительными органами для оперативного реагирования.",
          ],
        },
      },
      {
        title: "Пожарная безопасность",

        content: {
          description:
            "Пожарная безопасность обеспечивается современными системами пожаротушения, регулярными проверками и обучением сотрудников. Мы также проводим аудиты и внедряем новые технологии для предотвращения пожаров.",
          list: [
            "Автоматические системы пожаротушения, включая спринклеры и газовые системы.",
            "Эвакуационные планы на каждом этаже с четкой маркировкой путей эвакуации.",
            "Регулярные учения по эвакуации с участием всех сотрудников.",
            "Огнетушители и пожарные гидранты в доступных местах, с регулярной проверкой их исправности.",
            "Установка датчиков дыма и тепла в каждом помещении.",
            "Обучение сотрудников использованию противопожарного оборудования.",
          ],
        },
      },
      {
        title: "Медицинская безопасность",

        content: {
          description:
            "Медицинская безопасность включает в себя наличие медицинского персонала, аптечек первой помощи и обучение сотрудников. Мы также внедряем программы по поддержанию здоровья и профилактике заболеваний.",
          list: [
            "Квалифицированный медицинский персонал на территории, доступный 24/7.",
            "Аптечки первой помощи в каждом отделе, укомплектованные всеми необходимыми средствами.",
            "Обучение сотрудников оказанию первой помощи, включая сердечно-легочную реанимацию (СЛР).",
            "Договоры с ближайшими медицинскими учреждениями для экстренной госпитализации.",
            "Проведение регулярных медицинских осмотров сотрудников.",
            "Программы вакцинации и профилактики инфекционных заболеваний.",
          ],
        },
      },
      {
        title: "Информационная безопасность",

        content: {
          description:
            "Защита информации обеспечивается использованием современных технологий шифрования, регулярным обучением сотрудников и строгим соблюдением политик безопасности. Мы также проводим регулярные тестирования на уязвимости.",
          list: [
            "Шифрование данных при передаче и хранении с использованием алгоритмов AES-256.",
            "Регулярное обновление программного обеспечения для устранения уязвимостей.",
            "Обучение сотрудников по вопросам кибербезопасности, включая распознавание фишинговых атак.",
            "Проведение аудитов безопасности и тестирование на проникновение.",
            "Использование многофакторной аутентификации для доступа к критически важным системам.",
            "Резервное копирование данных ежедневно с хранением в защищенных дата-центрах.",
          ],
        },
      },
      {
        title: "Экологическая безопасность",

        content: {
          description:
            "Мы стремимся минимизировать воздействие на окружающую среду, соблюдая все экологические стандарты. Наши инициативы включают использование возобновляемых источников энергии и снижение углеродного следа.",
          list: [
            "Контроль за выбросами вредных веществ с использованием современных фильтров и систем очистки.",
            "Утилизация отходов в соответствии с экологическими стандартами, включая переработку и компостирование.",
            "Использование энергосберегающих технологий, таких как LED-освещение и солнечные панели.",
            "Проведение экологических аудитов для оценки воздействия на окружающую среду.",
            "Программы по сокращению использования пластика и переход на биоразлагаемые материалы.",
            "Сотрудничество с экологическими организациями для поддержки инициатив по защите природы.",
          ],
        },
      },
      {
        title: "Психологическая безопасность",

        content: {
          description:
            "Мы заботимся о психологическом благополучии наших сотрудников, создавая комфортную рабочую атмосферу и предоставляя поддержку в сложных ситуациях.",
          list: [
            "Проведение тренингов по управлению стрессом и эмоциональным выгоранием.",
            "Организация консультаций с психологами для сотрудников.",
            "Создание зон отдыха и релаксации в офисе.",
            "Программы по поддержанию work-life balance.",
            "Регулярные опросы сотрудников для выявления проблем и улучшения условий труда.",
          ],
        },
      },
    ],
    tableData: {
      title: "Статистика безопасности за последний год",
      columns: ["Показатель", "Значение", "Комментарий"],
      rows: [
        [
          "Количество инцидентов",
          "2",
          "Оба инцидента были успешно устранены без последствий.",
        ],
        [
          "Проведено учений",
          "12",
          "Учения включали пожарные тревоги, эвакуации и кибербезопасность.",
        ],
        [
          "Обучено сотрудников",
          "150",
          "Обучение охватило все отделы компании.",
        ],
        [
          "Установлено новых систем безопасности",
          "5",
          "Включая системы видеонаблюдения и контроля доступа.",
        ],
        [
          "Проведено медицинских осмотров",
          "200",
          "Все сотрудники прошли ежегодный медосмотр.",
        ],
        [
          "Сокращение выбросов CO2",
          "15%",
          "Благодаря внедрению энергосберегающих технологий.",
        ],
      ],
    },
    additionalInfo: {
      title: "Дополнительные инициативы",
      description:
        "Мы постоянно работаем над улучшением наших мер безопасности и внедряем новые инициативы. Вот некоторые из наших последних проектов:",
      initiatives: [
        "Внедрение системы искусственного интеллекта для прогнозирования и предотвращения инцидентов.",
        "Создание мобильного приложения для экстренного оповещения сотрудников.",
        "Разработка программы по снижению стресса на рабочем месте с помощью mindfulness-практик.",
        "Участие в международных программах по экологической безопасности и устойчивому развитию.",
      ],
    },
  },
  trainingSections: [
    {
      key: "physical",
      title: "Физическая безопасность",
      description:
        "Программы, направленные на подготовку персонала к действиям в случае физических угроз и обеспечения безопасной среды.",
      list: [
        "Тренировки по эвакуации и действиям в ЧС.",
        "Обучение использованию систем видеонаблюдения и контроля доступа.",
        "Симуляции реагирования на террористические угрозы.",
      ],

      resourceLink: "https://example.com/physical-safety-training",
    },
    {
      key: "fire",
      title: "Пожарная безопасность",
      description:
        "Комплексное обучение по предотвращению и реагированию на пожары.",
      list: [
        "Практические занятия по использованию огнетушителей.",
        "Инструктаж по эвакуационным маршрутам.",
        "Регулярные пожарные учения для всего персонала.",
      ],

      resourceLink: "https://example.com/fire-safety-guide",
    },
    {
      key: "medical",
      title: "Медицинская безопасность",
      description: "Навыки первой помощи и поддержание здоровья сотрудников.",
      list: [
        "Обучение СЛР (сердечно-легочной реанимации).",
        "Занятия по оказанию первой помощи при травмах.",
        "Лекции по профилактике заболеваний и вакцинации.",
      ],

      resourceLink: "https://example.com/medical-training",
    },
    {
      key: "information",
      title: "Информационная безопасность",
      description: "Обучение защите информации и цифровой гигиене.",
      list: [
        "Курсы по кибербезопасности и распознаванию фишинга.",
        "Инструктаж по использованию корпоративных систем.",
        "Введение в политику безопасности данных.",
      ],

      resourceLink: "https://example.com/cybersecurity-basics",
      resourceLink1: "https://example.com/cybersecurity-basics",
    },
    {
      key: "environmental",
      title: "Экологическая безопасность",
      description:
        "Осведомленность о воздействии на окружающую среду и устойчивые практики.",
      list: [
        "Семинары по переработке и снижению отходов.",
        "Тренинги по использованию энергоэффективного оборудования.",
        "Программа сокращения углеродного следа.",
      ],

      resourceLink: "https://example.com/eco-safety",
    },
    {
      key: "psychological",
      title: "Психологическая безопасность",
      description:
        "Создание комфортной атмосферы и забота о ментальном здоровье.",
      list: [
        "Тренинги по управлению стрессом и выгоранием.",
        "Групповые занятия по mindfulness и медитации.",
        "Обучение по теме эмпатичного общения.",
      ],

      resourceLink: "https://example.com/mental-health",
    },
  ],
  titlePageTraining: "Обучение и тренинги",
  footer: {
    name: "Пушкарев Виталий",
    email: "Email:",
    education:
      "Новосибирский государственный технический университет, Факультет автоматики и вычислительной техникики Направление: Информационная безопасность автоматизированных систем, Группа: АБс-323",
    github: "GitHub",
    vk: "ВКонтакте",
    telegramQR: "Telegram QR",
    projectName: "Спортивные сооружения",
  },
  resetPassword: {
    title: "Восстановление пароля",

    emailRequired: "Email обязателен",
    emailLatinOnly: "Email должен содержать только латиницу, без пробелов",
    emailInvalid: "Некорректный email",
    codeRequired: "Код обязателен",
    invalidCode: "Код должен состоять из 6 цифр",
    passwordRequired: "Пароль обязателен",
    passwordTooShort: "Пароль должен быть не менее 6 символов",
    passwordLatinOnly:
      "Пароль должен содержать только латиницу, без пробелов и кириллицы",
    passwordDigitRequired: "Пароль должен содержать хотя бы одну цифру",
    confirmPasswordRequired: "Подтвердите пароль",
    passwordsDontMatch: "Пароли не совпадают",
    requestError: "Ошибка при отправке кода.",
    codeInvalidOrExpired: "Неверный или истёкший код.",
    resetError: "Не удалось сбросить пароль.",
    success: "Пароль успешно обновлён. Перенаправление...",

    labels: {
      email: "Email",
      code_from_email: "Код из письма",
      new_password: "Новый пароль",
      confirm_password: "Подтвердите пароль",
    },

    errors: {
      email_latin_only: "Email должен содержать только латиницу, без пробелов",
      email_invalid: "Некорректный email",
      password_required: "Пароль обязателен",
      password_too_short: "Пароль должен быть не менее 6 символов",
      password_latin_only:
        "Пароль должен содержать только латиницу, без пробелов и кириллицы",
      password_digit_required: "Пароль должен содержать хотя бы одну цифру",
      confirm_password_required: "Подтвердите пароль",
      passwords_dont_match: "Пароли не совпадают",
    },

    buttons: {
      send_code: "Отправить код",
      confirm_code: "Подтвердить код",
      reset_password: "Сбросить пароль",
      sending: "Отправка...",
      verifying: "Проверка...",
      resetting: "Сброс...",
    },
  },
  qr: {
    title: "Генерация QR-билетов",

    sector: "Сектор",
    row: "Ряд",
    buy: "Купить билет",
    success: "Билет успешно куплен!",
    error: "Ошибка при покупке билета",
  },
  settingsModal: {
    settings: "Настройки",
    exit: "Выйти",
    name: "Имя",
    error: "Имя не может быть пустым",
    language: "Язык",
  },
};
