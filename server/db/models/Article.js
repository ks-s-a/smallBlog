module.exports = function createArticleModel(db) {

  var Article = db.define('article', {
    id: {
      allowNull: false,
      type: db.Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    header: {
      allowNull: false,
      type: db.Sequelize.STRING,
    },
    text: {
      allowNull: false,
      type: db.Sequelize.TEXT,
    },
    dateTag: {
      type: db.Sequelize.BOOLEAN,
      allowNull: true,
    },
    loveTag: {
      type: db.Sequelize.BOOLEAN,
      allowNull: true,
    },
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });


  if (!db.isProduction) {
    // Fill tables test data
    Article.sync({force: true})
      .then(function () {
        // Table created
        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: true,
          loveTag: false,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });
        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: true,
          loveTag: false,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Trulala',
          text: 'lkdsjfg lkjsdlkfgj lksdjfg kldskfgj sgjiotrej iw howj ggog sjtiogj joig soidjfg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Tratata',
          text: 'ij3iojifilsdrilgjelsj glsij ligj lsdfjg ij5il jlisj glisej gliej li gjslig jilser jg.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Proror',
          text: 'orjgiji345ljglw4ijg5j wilgj il45g ls gj i5ji jj gs jgiljsliergjlsie5j. ывопращкоепшщ окщшео щопщшк оешщокщ ещшквщш ковщ еопкещ щвошщо в .в д одюв .н .внш.в ш.нвшошнодившоишд.вши.швшнвоншиондшо ищецшошошкено кшнеорш вон.и вн .ивш.нишвонившеоинов.. вн.',
          dateTag: false,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: true,
          loveTag: true,
        });

        Article.create({
          header: 'Lololo',
          text: 'j3i45glwigiljliej5gijsilej ilegilj5gi jseil5j giselj lig5 sleig5isei ljgijs jrlgji sji .',
          dateTag: false,
          loveTag: true,
        });

      })
      .catch(function(reason){
        // failure!
        console.log('Article model creation failed! Reason is: ', reason);
      });
    } else {
      Article.sync();
    }
}
