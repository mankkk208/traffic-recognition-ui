# Traffic Recognition UI

A modern web application for traffic recognition and analysis, built with React and TypeScript.

## Features

- Modern React with TypeScript
- Responsive design
- Docker support
- Nginx production server
- Health monitoring

## Prerequisites

- Node.js 18 or higher
- Docker (optional, for containerized deployment)
- npm or yarn package manager

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone <your-repository-url>
cd traffic-recognition-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

1. Build the application:
```bash
npm run build
```

2. The build output will be in the `build` directory

## Docker Deployment

### Building the Docker Image

```bash
docker build -t mankkk/traffic-recognition-ui .
```

### Running the Container

```bash
docker run -p 80:80 mankkk/traffic-recognition-ui
```

The application will be available at `http://localhost:80`

## Project Structure

```
traffic-recognition-ui/
├── src/               # Source code
├── public/           # Static files
├── node_modules/     # Dependencies
├── Dockerfile        # Docker configuration
├── nginx.conf        # Nginx configuration
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript configuration
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `firebase deploy`

## Technologies Used

- React 19
- TypeScript
- Docker
- Nginx
- Emotion (for styling)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [your-email@example.com]

Project Link: [https://github.com/yourusername/traffic-recognition-ui](https://github.com/yourusername/traffic-recognition-ui)
