import DefaultuserImage from '../assets/Images/default-user-image.png'

const teamMembers = [
  {
    name: "Christophe Thuwis",
    title: "AI Engineer",
    imageUrl: DefaultuserImage,
  },
  {
    name: "Calvin Nijenhuis",
    title: "FUNCTION?",
    imageUrl: DefaultuserImage,
  },
  {
    name: "Trent Evans",
    title: "FUNCTION?",
    imageUrl: DefaultuserImage,
  }
];

const TeamLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto">
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
          Meet Our Team
        </h2>
        <p className="mt-4 text-base sm:text-lg">
          Type something here about our team.... ALSO LinkedIn icon/links under our names!
        </p>
      </div>
      <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-12 max-w-screen-lg mx-auto justify-center">
        {teamMembers.map((member) => (
          <div key={member.name} className="text-center">
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-20 w-20 rounded-full object-cover mx-auto bg-secondary"
                width={160}
                height={160}
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-secondary mx-auto"></div>
            )}
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
            <p className="text-muted-foreground">{member.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamLayout;
