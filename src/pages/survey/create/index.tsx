import Head from 'next/head';
import withAnimation from 'shared/HOC/withAnimation';
import withProtectedRoute from 'shared/HOC/withProtectedRoute';
import Button, { ButtonVariant } from 'shared/components/Button/Button';
import Header from 'shared/components/Header/Header';
import Input from 'shared/components/Input/Input';
import EmojiPicker from 'features/surveys/components/EmojiPicker/EmojiPicker';
import { useCreateSurveyManager } from 'features/surveys/managers/createSurveyManager';

const MIN_EMOJIS = 2;
const MAX_EMOJIS = 8;

function SurveyCreatePage() {
  const {
    title,
    pack,
    error,
    handleChangeTitle,
    handleEmotePick,
    handleEmoteRemove,
    handleAddingNewEmote,
    createSurvey,
    isCreating,
  } = useCreateSurveyManager();

  return (
    <>
      <Head>
        <title>Create Survey</title>
        <meta name="description" content="Create Survey - Employee Pulse" />
      </Head>

      <Header>Create new survey</Header>
      <Input
        label="Survey title"
        name="survey-title"
        placeholder="Title..."
        value={title}
        error={!title ? error : undefined}
        className="!mb-1 py-3"
        onChange={handleChangeTitle}
        absoluteError
      />

      <div className="mt-8">
        <div className="mb-3 block text-left font-semibold">
          Click on icon to change
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, 64px)',
            justifyContent: 'space-between',
            gridGap: '8px',
          }}
        >
          {pack.map((emote, idx) => (
            <EmojiPicker
              key={idx}
              index={idx}
              pickedEmoji={emote}
              onEmotePick={handleEmotePick}
              onEmoteRemove={
                pack.length > MIN_EMOJIS ? handleEmoteRemove : undefined
              }
            />
          ))}
          {pack.length < MAX_EMOJIS && (
            <EmojiPicker addEmoji={true} onEmoteAdd={handleAddingNewEmote} />
          )}
        </div>
        <div className="flex justify-center">
          <Button
            name="create-survey"
            onClick={createSurvey}
            className="z-0 mt-9 w-full sm:w-auto"
            variant={ButtonVariant.PRIMARY}
            isLoading={isCreating}
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
}

export default withProtectedRoute(withAnimation(SurveyCreatePage));