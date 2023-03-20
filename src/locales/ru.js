export default {
  translation: {
    text: {
      header: 'RSS агрегатор',
      slogan: 'Начните читать RSS сегодня! Это легко, это красиво.',
      example: 'Пример: 1. http://lorem-rss.herokuapp.com/feed 2. https://ru.hexlet.io/lessons.rss',
      label: 'Ссылка RSS',
      submitButton: 'Добавить',
      readButton: 'Просмотре',
    },
    feedback: {
      error: {
        urlRequired: 'Не должно быть пустым',
        notValidURL: 'Ссылка должна быть валидным URL',
        alreadyExists: 'RSS уже существует',
        netError: 'Ошибка сети',
        parsingError: 'Ресурс не содержит валидный RSS',
      },
      success: {
        feedAdded: 'RSS успешно загружен',
      },
    },
  },
};
