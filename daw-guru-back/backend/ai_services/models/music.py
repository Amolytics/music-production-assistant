    def button_by_button_instructions(self, daw, task):
        """
        Provide button-by-button instructions for a given DAW and task.
        Args:
            daw (str): Name of the DAW (e.g., 'Ableton Live', 'FL Studio', 'Logic Pro', etc.)
            task (str): The task the user wants to accomplish.
        Returns:
            str: Step-by-step instructions or a helpful message.
        """
        daw = (daw or '').lower()
        task = (task or '').lower()
        # Example templates for leading DAWs
        if 'ableton' in daw:
            if 'add track' in task:
                return (
                    "Ableton Live - Add Track:\n"
                    "1. Click the 'Create' menu at the top.\n"
                    "2. Select 'Insert Audio Track' or 'Insert MIDI Track'.\n"
                    "3. The new track appears in your session."
                )
            if 'export' in task:
                return (
                    "Ableton Live - Export Audio:\n"
                    "1. Go to 'File' > 'Export Audio/Video'.\n"
                    "2. Set your export settings.\n"
                    "3. Click 'Export' and choose a location."
                )
        if 'fl studio' in daw:
            if 'add track' in task:
                return (
                    "FL Studio - Add Track:\n"
                    "1. Press F6 to open the Channel Rack.\n"
                    "2. Click the '+' button at the bottom.\n"
                    "3. Choose the instrument or audio track you want."
                )
            if 'export' in task:
                return (
                    "FL Studio - Export Audio:\n"
                    "1. Go to 'File' > 'Export' > 'WAV file' (or MP3, etc.).\n"
                    "2. Set your export options.\n"
                    "3. Click 'Start'."
                )
        if 'logic' in daw:
            if 'add track' in task:
                return (
                    "Logic Pro - Add Track:\n"
                    "1. Click the '+' button above the track headers.\n"
                    "2. Choose 'Audio' or 'Software Instrument'.\n"
                    "3. Click 'Create'."
                )
            if 'export' in task:
                return (
                    "Logic Pro - Export Audio:\n"
                    "1. Go to 'File' > 'Export' > 'All Tracks as Audio Files' or '1 Track as Audio File'.\n"
                    "2. Set your export options.\n"
                    "3. Click 'Export'."
                )
        if 'cubase' in daw:
            if 'add track' in task:
                return (
                    "Cubase - Add Track:\n"
                    "1. Right-click in the track list area.\n"
                    "2. Select 'Add Audio Track' or 'Add Instrument Track'.\n"
                    "3. Configure and click 'Add Track'."
                )
            if 'export' in task:
                return (
                    "Cubase - Export Audio:\n"
                    "1. Go to 'File' > 'Export' > 'Audio Mixdown'.\n"
                    "2. Set your export range and options.\n"
                    "3. Click 'Export Audio'."
                )
        if 'pro tools' in daw:
            if 'add track' in task:
                return (
                    "Pro Tools - Add Track:\n"
                    "1. Go to 'Track' > 'New'.\n"
                    "2. Choose track type and number.\n"
                    "3. Click 'Create'."
                )
            if 'export' in task:
                return (
                    "Pro Tools - Export Audio:\n"
                    "1. Select the range to export.\n"
                    "2. Go to 'File' > 'Bounce to' > 'Disk'.\n"
                    "3. Set options and click 'Bounce'."
                )
        if 'studio one' in daw:
            if 'add track' in task:
                return (
                    "Studio One - Add Track:\n"
                    "1. Click the 'Add Track' button above the track list.\n"
                    "2. Choose track type and click 'OK'."
                )
            if 'export' in task:
                return (
                    "Studio One - Export Audio:\n"
                    "1. Go to 'Song' > 'Export Mixdown'.\n"
                    "2. Set your options and click 'OK'."
                )
        if 'reaper' in daw:
            if 'add track' in task:
                return (
                    "Reaper - Add Track:\n"
                    "1. Double-click in the track control panel area.\n"
                    "2. Or go to 'Track' > 'Insert New Track'."
                )
            if 'export' in task:
                return (
                    "Reaper - Export Audio:\n"
                    "1. Go to 'File' > 'Render'.\n"
                    "2. Set your render options.\n"
                    "3. Click 'Render'."
                )
        return "Let me know your DAW and the task, and I’ll give you step-by-step instructions!"
# DAW-aware, non-intrusive AI music model

class AIMusicModel:
    def suggest_chord_progression(self, genre="Pop", mood="Happy"):
        """
        Suggest chord progressions based on genre and mood.
        Args:
            genre (str): Music genre.
            mood (str): Mood or emotion.
        Returns:
            list: Chord progression.
        """
        # Placeholder: In real implementation, use music theory or AI models
        progressions = {
            "Pop": ["C", "G", "Am", "F"],
            "Rock": ["E", "A", "B", "C#m"],
            "Jazz": ["Dm7", "G7", "Cmaj7", "Fmaj7"],
            "EDM": ["F", "Dm", "Bb", "C"],
        }
        return progressions.get(genre, ["C", "G", "Am", "F"])

    def search_free_sample(self, description, genre=None):
        """
        Search for a free audio sample online to fit the user's need.
        Args:
            description (str): Description of the sample needed.
            genre (str): Optional music genre.
        Returns:
            str: URL or info about the sample.
        """
        # Placeholder: In real implementation, integrate with sample libraries/APIs
        print(f"Searching for free sample: {description}, genre: {genre}")
        return "https://freesound.org/people/sample_user/sounds/123456/"

    def generate_sung_lyrics(self, lyrics, emotion=None, ethnicity=None, language="en", style=None, voice="default", tuning=None):
        """
        Generate sung lyrics audio with options for emotion, ethnicity, language, and music style.
        Args:
            lyrics (str): Lyrics to sing.
            emotion (str): Emotion to convey (e.g., happy, sad, angry).
            ethnicity (str): Ethnic vocal style (e.g., gospel, Latin, Asian).
            language (str): Language for singing.
            style (str): Music style (e.g., pop, rap, classical).
            voice (str): Voice profile to use.
        Returns:
            audio_data: Sung lyrics audio.
        """
        # Placeholder: Integrate with singing voice synthesis library or API
        print(f"[Sung Lyrics] Singing '{lyrics}' with emotion: {emotion}, ethnicity: {ethnicity}, language: {language}, style: {style}, voice: {voice}, tuning: {tuning}")
        # tuning can include pitch, vibrato, timbre, etc.
        return b"SUNG_AUDIO_PLACEHOLDER"

    def text_to_speech(self, text, voice="default"):
        """
        Convert text to speech (audio output).
        Args:
            text (str): Text to convert.
            voice (str): Voice profile to use.
        Returns:
            audio_data: Audio representation of the text.
        """
        # Placeholder: Integrate with TTS library or API
        print(f"[TTS] Speaking: {text} (voice: {voice})")
        return b"AUDIO_DATA_PLACEHOLDER"

    def speech_to_text(self, audio_data, language="en"):
        """
        Convert speech (audio input) to text.
        Args:
            audio_data: Audio input to transcribe.
            language (str): Language for transcription.
        Returns:
            str: Transcribed text.
        """
        # Placeholder: Integrate with STT library or API
        print(f"[STT] Transcribing audio in language: {language}")
        return "Transcribed text placeholder"

    def generate_lyrics(self, audio_data=None, style=None, topic=None):
        """
        Generate lyrics for music upon request.
        Args:
            audio_data: Optional, the music to base lyrics on.
            style: Optional, desired lyrical style (e.g., pop, rap, ballad).
            topic: Optional, theme or subject for lyrics.
        Returns:
            str: Generated lyrics.
        """
        # Placeholder: In real implementation, use AI/ML models for lyric generation
        if style:
            return f"Here are some {style} lyrics about {topic or 'your music'}!"
        return "Here are some lyrics for your track! (AI-generated)"

    def analyze_audio(self, audio_data):
        """
        Analyze audio data and offer help if needed.
        Args:
            audio_data: Raw audio stream or file.
        """
        # Placeholder: In real implementation, use audio processing libraries (e.g., librosa, pydub)
        # Example: Detect silence, clipping, or off-beat
        if self.detect_clipping(audio_data):
            return "Warning: Your track is clipping. Would you like help fixing it?"
        if self.detect_silence(audio_data):
            return "Notice: There is a long silence. Need help with arrangement?"
        # Add more analysis as needed
        return None

    def detect_clipping(self, audio_data):
        # Placeholder logic for clipping detection
        return False

    def detect_silence(self, audio_data):
        # Placeholder logic for silence detection
        return False

    def set_role(self, role):
        """
        Set the AI's role: 'tutor', 'assistant', or 'co-producer'.
        """
        assert role in ["tutor", "assistant", "co-producer"], "Invalid role"
        self.role = role

    def act_as_tutor(self, topic):
        """
        Provide educational guidance on a music topic or DAW feature.
        """
        return f"Tutor: Here's how to use {topic} in your DAW."

    def act_as_assistant(self, task):
        """
        Help with routine tasks, e.g., track setup, plugin management.
        """
        return f"Assistant: Let me help you with {task}."

    def act_as_co_producer(self, idea):
        """
        Collaborate creatively, suggesting ideas or improvements.
        """
        return f"Co-Producer: How about trying {idea} in your project?"

    def __init__(self, daw_list=None, plugins=None):
        # DAW-agnostic: can work with any DAW, not tied to specific ones
        self.daw_list = daw_list or []  # Empty means agnostic
        self.plugins = plugins or self.scan_plugins_on_startup()
        self.user_context = {}

    def scan_plugins_on_startup(self):
        """
        Automatically search for available plugins on startup.
        Returns a dictionary of detected plugins.
        """
        # Placeholder: In real implementation, scan system/plugin folders or DAW APIs
        print("Scanning for available plugins...")
        # Simulate user-specific plugin detection
        detected_plugins = {
            "EQ": "Equalizer for tone shaping",
            "Compressor": "Controls dynamics",
            "Reverb": "Adds space and depth",
            # Add more or fewer plugins depending on user system
        }
        return detected_plugins

    def load_plugin_knowledge(self):
        """
        Load or initialize knowledge about audio plugins (effects, instruments, utilities).
        """
        # Placeholder: In real implementation, load from database or API
        return {
            "EQ": "Equalizer for tone shaping",
            "Compressor": "Controls dynamics",
            "Reverb": "Adds space and depth",
            "Delay": "Creates echo effects",
            "Synth": "Generates musical sounds",
            "Limiter": "Prevents clipping",
            # Add more plugins as needed
        }

    def suggest_plugin(self, task):
        """
        Recommend a plugin based on the user's task or problem.
        """
        # Simple mapping for demonstration
        if "mix" in task:
            return "Try using an EQ or Compressor for mixing."
        if "space" in task or "depth" in task:
            return "Reverb can help add space and depth."
        if "loudness" in task:
            return "A Limiter can help control loudness."
        return "Let me know your task for a plugin recommendation."

    def observe_workflow(self, workflow_events):
        """
        Watch user workflow events to decide when to offer help.
        Args:
            workflow_events (list): List of user actions/events in the DAW.
        """
        self.user_context['events'] = workflow_events
        if self.should_offer_help(workflow_events):
            return self.suggest_assistance()
        return None

    def monitor_realtime(self, event_stream):
        """
        Simulate real-time monitoring of user workflow, as if 'watching over their shoulder'.
        Args:
            event_stream (iterable): Stream of user actions/events in the DAW.
        """
        from time import sleep
        for event in event_stream:
            print(f"Observed event: {event}")
            result = self.observe_workflow(self.user_context.get('events', []) + [event])
            self.user_context['events'] = self.user_context.get('events', []) + [event]
            if result:
                print(result)
            sleep(0.1)  # Simulate real-time delay

    def should_offer_help(self, events):
        # Placeholder logic: offer help if user repeats an action 3+ times
        from collections import Counter
        event_counts = Counter(events)
        for event, count in event_counts.items():
            if count >= 3:
                return True
        return False

    def suggest_assistance(self):
        # Non-intrusive suggestion
        return "Would you like help with your current task?"

    def generate(self):
        return "Generated music"
