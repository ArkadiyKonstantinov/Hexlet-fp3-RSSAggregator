export default {
  translation: {
    text: {
      header: 'RSS агрегатор',
      slogan: 'Начните читать RSS сегодня! Это легко, это красиво.',
      example: 'Пример: http://lorem-rss.herokuapp.com/feed\nhttps://ru.hexlet.io/lessons.rss',
      label: 'Ссылка RSS',
    },
    feedback: {
      error: {
        notValidURL: 'Ссылка должна быть валидным URL',
        alreadyExists: 'RSS уже существует',
        netError: 'Ошибка сети',
        parsingError: 'Ресурс не содержит валидный RSS',
      },
      success: {
        feedAdded: 'RSS успешно загружен',
      },
    },
    // errors: {
    //   validate: {
    //     not_valid_url: 'Ссылка должна быть валидным URL',
    //   },
    // },
  },
};
