import * as yup from 'yup';

export default (state) => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.validate.not_valid_url' }),
    },
  });

  const schema = yup.object().shape(
    {
      rssUrl: yup.string().url(),
    },
  );

  return schema.validate(state.form.fields, { abortEarly: false });
};
